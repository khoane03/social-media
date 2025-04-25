package com.dev.social.dto.result;

import java.time.LocalDateTime;

public interface PostResult {
    String getPostId();
    String getUserId();
    String getName();
    String getAvatarUrl();
    Boolean getVerified();
    String getContents();
    LocalDateTime getCreatedAt();
    String getImageUrl();
}
