package com.dev.social.dto.result;

public interface PostResult {
    String getPostId();
    String getUserId();
    String getName();
    String getAvatarUrl();
    Boolean getVerified();
    String getContents();
    String getCreatedAt();
    String getImageUrl();
}
