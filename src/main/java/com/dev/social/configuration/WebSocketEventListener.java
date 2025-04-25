package com.dev.social.configuration;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.security.Principal;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class WebSocketEventListener {

    final SimpMessagingTemplate messagingTemplate;

    // Store the current users in a thread-safe set
    static final Set<String> currentUsers = ConcurrentHashMap.newKeySet();

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());

        String username = Optional.ofNullable(accessor.getUser())
                .map(Principal::getName)
                .orElse("unknown");

        if (!"unknown".equals(username)) {
            currentUsers.add(username);
            log.info("User connected: {}, Total online: {}", username, currentUsers.size());
            broadcastOnlineUsers();
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());

        String username = Optional.ofNullable(accessor.getUser())
                .map(Principal::getName)
                .orElse("unknown");

        if (!"unknown".equals(username) && currentUsers.remove(username)) {
            log.info("User disconnected: {}, Total online: {}", username, currentUsers.size());
            broadcastOnlineUsers();
        }
    }

    void broadcastOnlineUsers() {
        messagingTemplate.convertAndSend("/public/online", currentUsers);
        log.info("Broadcasting online users: {}", currentUsers);
    }

    public static Set<String> getOnlineUsers() {
        return currentUsers;
    }
}