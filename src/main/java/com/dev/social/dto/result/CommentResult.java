package com.dev.social.dto.result;


import java.time.LocalDateTime;

public interface CommentResult {
    String getId();
    String getPostId();
    String getName();
    String getAvatarUrl();
    String getContents();
    LocalDateTime getCreatedAt();

}
