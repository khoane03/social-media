package com.dev.social.dto.response;

import com.dev.social.dto.result.PostResult;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostResponseDTO {
    String postId;
    String userId;
    String name;
    String avatarUrl;
    Boolean isVerified;
    String postContent;
    String createdAt;
    List<String> images;

    public PostResponseDTO(PostResult postResult) {
        if (postResult != null) {
            this.setPostId(postResult.getPostId());
            this.setUserId(postResult.getUserId());
            this.setName(postResult.getName());
            this.setAvatarUrl(postResult.getAvatarUrl());
            this.setIsVerified(postResult.getVerified());
            this.setPostContent(postResult.getContents());
            this.setImages(new ArrayList<>());
            this.setCreatedAt(postResult.getCreatedAt());
        }
    }

}
