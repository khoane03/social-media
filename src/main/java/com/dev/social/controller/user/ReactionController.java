package com.dev.social.controller.user;


import com.dev.social.dto.request.user.ReactionRequest;
import com.dev.social.dto.response.ApiResponseDTO;
import com.dev.social.entity.Reaction;
import com.dev.social.service.user.ReactionService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequestMapping("/reactions")
public class ReactionController {

    final ReactionService reactionService;

    @PostMapping()
    public ApiResponseDTO<?> createReaction(@Valid @RequestBody ReactionRequest reaction) {
        reactionService.makeFeel(reaction);
        return ApiResponseDTO.build();
    }

    @GetMapping("/{postId}")
    public ApiResponseDTO<?> getReactionsByPostId(@PathVariable String postId) {
        return ApiResponseDTO.build(reactionService.getReactionsByPostId(postId));
    }

}
