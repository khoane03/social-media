package com.dev.social.dto.response;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReactionResponseDto {
    String postId;
    Integer totalReactions = 0;
    List<ReactionDetail> reactions = new ArrayList<>();

    public ReactionResponseDto(String postId) {
        this.postId = postId;
    }

}