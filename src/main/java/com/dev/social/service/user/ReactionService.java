package com.dev.social.service.user;

import com.dev.social.dto.request.user.ReactionRequest;
import com.dev.social.dto.response.ReactionResponseDto;


public interface ReactionService {
    void makeFeel(ReactionRequest req);

    ReactionResponseDto getReactionsByPostId(String postId);

}
