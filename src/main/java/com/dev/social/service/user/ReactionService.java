package com.dev.social.service.user;

import com.dev.social.dto.request.user.ReactionRequest;
import com.dev.social.dto.response.ReactionResponseDto;

import java.util.List;

public interface ReactionService {
    void makeFeel(ReactionRequest req);

    List<ReactionResponseDto> getReactionsByPostId(String postId);

}
