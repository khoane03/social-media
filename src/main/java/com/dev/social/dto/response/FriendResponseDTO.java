package com.dev.social.dto.response;

import com.dev.social.entity.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public class FriendResponseDTO {

    String friendId;
    String name;
    boolean isVerified;
    String avatarUrl;
    String status;

    public FriendResponseDTO(User user) {
        if (user != null) {
            this.setFriendId(user.getId());
            this.setName(user.getName());
            this.setVerified(user.isVerified());
            this.setAvatarUrl(user.getAvatarUrl());
        }
    }

    public FriendResponseDTO(String friendId, String status) {
        this.setFriendId(friendId);
        this.setStatus(status);
    }
}
