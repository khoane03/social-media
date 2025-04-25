package com.dev.social.service.user.impl;

import com.dev.social.dto.request.user.ChatRequestDTO;
import com.dev.social.dto.request.user.DeleteChatRequestDTO;
import com.dev.social.dto.request.user.NotificationRequestDTO;
import com.dev.social.dto.response.ChatResponseDTO;
import com.dev.social.dto.response.ListChatResponseDTO;
import com.dev.social.entity.Chat;
import com.dev.social.entity.User;
import com.dev.social.repository.ChatRepository;
import com.dev.social.repository.UserRepository;
import com.dev.social.service.user.ChatService;
import com.dev.social.service.user.NotificationService;
import com.dev.social.utils.constants.AppConst;
import com.dev.social.utils.enums.DeleteChatTypeEnum;
import com.dev.social.utils.exception.AppException;
import com.dev.social.utils.exception.ErrorMessage;
import com.dev.social.utils.validation.EnumValidate;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class ChatServiceImpl implements ChatService {

    ChatRepository chatRepository;
    UserRepository userRepository;
    NotificationService notificationService;

    @Override
    public ChatResponseDTO addChat(ChatRequestDTO chatRequestDTO) {
        User recipient = userRepository.findByUsername(chatRequestDTO.getRecipient())
                .orElseThrow(() -> new AppException(ErrorMessage.USER_NOT_FOUND));
        User sender = userRepository.findByUsername(chatRequestDTO.getSender())
                .orElseThrow(() -> new AppException(ErrorMessage.USER_NOT_FOUND));

        // send notification
        notificationService.createNotification(NotificationRequestDTO.builder()
                .content(AppConst.NEW_MESSAGE)
                .userId(recipient.getId())
                .build());

        return new ChatResponseDTO(chatRepository.save(
                Chat.builder()
                        .sender(sender)
                        .recipient(recipient)
                        .contents(chatRequestDTO.getContent())
                        .build()
        ));

    }

    @Override
    public List<ChatResponseDTO> getHistory(String recipientId, Principal principal) {
        return chatRepository.findChatHistoryBetweenUsers(
                recipientId,
                getUserLogin(principal).getId()
        );
    }

    @Override
    public List<ListChatResponseDTO> getListChat(Principal principal) {
        String userId = getUserLogin(principal).getId();
        return chatRepository.getListChatByUserId(userId);
    }

    @Override
    public void deleteChat(DeleteChatRequestDTO req) {
        DeleteChatTypeEnum type = EnumValidate.isValidEnum(DeleteChatTypeEnum.class, req.getType(), ErrorMessage.INVALID_TYPE);
        switch (type) {
            case ALL -> deleteConversation(req.getSenderId(), req.getRecipientId());
            case ONE -> deleteSingleMessage(req.getId());
            default -> throw new AppException(ErrorMessage.INVALID_TYPE);
        }
    }

    void deleteConversation(String senderId, String recipientId) {
        chatRepository.deleteAllBySenderAndRecipient(senderId, recipientId);
    }

    void deleteSingleMessage(String id) {
        var message = chatRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorMessage.MESSAGE_NOT_FOUND));
        chatRepository.delete(message);
    }


    User getUserLogin(Principal principal) {
        if (principal == null) {
            throw new AppException(ErrorMessage.USER_NOT_FOUND);
        }
        String username = principal.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorMessage.USER_NOT_FOUND));
    }
}
