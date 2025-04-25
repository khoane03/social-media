package com.dev.social.controller.user;

import com.dev.social.dto.request.user.ChatRequestDTO;
import com.dev.social.dto.request.user.DeleteChatRequestDTO;
import com.dev.social.dto.response.ApiResponseDTO;
import com.dev.social.dto.response.ChatResponseDTO;
import com.dev.social.dto.response.ListChatResponseDTO;
import com.dev.social.service.user.ChatService;
import com.dev.social.utils.constants.AppConst;
import com.dev.social.utils.exception.AppException;
import com.dev.social.utils.exception.ErrorMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatController {

    final ChatService chatService;
    final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat")
    public void sendMessage(@Payload ChatRequestDTO req) {
        try {
            var response = chatService.addChat(req);
            messagingTemplate.convertAndSendToUser(req.getRecipient(), "/private/chat", response);
            messagingTemplate.convertAndSendToUser(req.getSender(), "/private/chat", response);
        } catch (Exception e) {
            log.error("Error processing chat message: {}", req, e);
            throw new AppException(ErrorMessage.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ApiResponseDTO<List<ChatResponseDTO>> getChatById(@PathVariable("id") String id, Principal principal) {
        return ApiResponseDTO.of(chatService.getHistory(id, principal));
    }

    @GetMapping("/list-chat")
    public ApiResponseDTO<List<ListChatResponseDTO>> getListChatRealTime(Principal principal) {
        return ApiResponseDTO.of(chatService.getListChat(principal));
    }

    @DeleteMapping()
    public ApiResponseDTO<String> deleteChat(@RequestBody DeleteChatRequestDTO req) {
        chatService.deleteChat(req);
        return ApiResponseDTO.of(AppConst.SUCCESS);
    }
}
