package com.dev.social.service.user;

import com.dev.social.dto.request.user.ChatRequestDTO;
import com.dev.social.dto.request.user.DeleteChatRequestDTO;
import com.dev.social.dto.response.ChatResponseDTO;
import com.dev.social.dto.response.ListChatResponseDTO;
import com.dev.social.entity.Chat;

import java.security.Principal;
import java.util.List;

public interface ChatService {
    ChatResponseDTO addChat(ChatRequestDTO chatRequestDTO);

    List<ChatResponseDTO> getHistory(String recipientId, Principal principal);

    List<ListChatResponseDTO> getListChat(Principal principal);

    void deleteChat(DeleteChatRequestDTO req);
}
