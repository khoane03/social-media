package com.dev.social.repository;

import com.dev.social.dto.response.ChatResponseDTO;
import com.dev.social.dto.response.ListChatResponseDTO;
import com.dev.social.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, String> {

    @Query("SELECT new com.dev.social.dto.response.ChatResponseDTO(" +
            "c.id, c.sender.username, c.recipient.username, c.contents, c.createdAt) " +
            "FROM Chat c " +
            "WHERE (c.sender.id = :userId AND c.recipient.id = :targetId) " +
            "OR (c.sender.id = :targetId AND c.recipient.id = :userId) " +
            "ORDER BY c.createdAt ASC")
    List<ChatResponseDTO> findChatHistoryBetweenUsers(@Param("userId") String userId, @Param("targetId") String targetId);

    @Query("SELECT DISTINCT new com.dev.social.dto.response.ListChatResponseDTO(" +
            "CASE WHEN c.sender.id = :userId THEN c.recipient.id ELSE c.sender.id END, " +
            "CASE WHEN c.sender.id = :userId THEN c.recipient.name ELSE c.sender.name END, " +
            "CASE WHEN c.sender.id = :userId THEN c.recipient.username ELSE c.sender.username END, " +
            "CASE WHEN c.sender.id = :userId THEN c.recipient.avatarUrl ELSE c.sender.avatarUrl END) " +
            "FROM Chat c WHERE c.sender.id = :userId OR c.recipient.id = :userId")
    List<ListChatResponseDTO> getListChatByUserId(@Param("userId") String userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Chat c " +
            "WHERE (c.sender.id = :senderId AND c.recipient.id = :recipientId) OR " +
            "(c.sender.id = :recipientId AND c.recipient.id = :senderId) ")
    void deleteAllBySenderAndRecipient(@Param("senderId") String senderId, @Param("recipientId") String recipientId);
}
