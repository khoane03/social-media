package com.dev.social.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReactionRequest {
    @NotBlank(message = "Post ID cannot be blank")
    String postId;

    @NotBlank(message = "Reaction type cannot be blank")
    String reactionType;
}
