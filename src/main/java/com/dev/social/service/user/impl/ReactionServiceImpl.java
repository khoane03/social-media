package com.dev.social.service.user.impl;

import com.dev.social.entity.Reaction;
import com.dev.social.entity.Post;
import com.dev.social.entity.User;
import com.dev.social.repository.ReactionRepository;
import com.dev.social.repository.PostRepository;
import com.dev.social.repository.UserRepository;
import com.dev.social.service.user.ReactionService;
import com.dev.social.utils.enums.ReactionTypeEnum;
import com.dev.social.utils.exception.AppException;
import com.dev.social.utils.exception.ErrorMessage;
import com.dev.social.utils.validation.FeelValidate;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ReactionServiceImpl implements ReactionService {

    ReactionRepository reactionRepository;
    PostRepository postRepository;
    UserRepository userRepository;
    FeelValidate feelValidate;

    @Override
    public void makeFeel(String postId, String req) {
        ReactionTypeEnum feelType = feelValidate.isValidFeelType(req);
        reactionRepository.findByPostIdAndUserId(postId, getUser().getId())
                .ifPresentOrElse(reaction -> {
                            if (reaction.getReactionType().equals(feelType)) {
                                reactionRepository.deleteById(reaction.getId());
                            } else {
                                reaction.setReactionType(feelType);
                                reactionRepository.save(reaction);
                            }
                        },
                        () -> reactionRepository.save(Reaction.builder()
                                .reactionType(feelType)
                                .post(getPost(postId))
                                .user(getUser())
                                .build()));
    }

    User getUser() {
        return userRepository.findByUsername(SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName())
                .orElseThrow(() -> new AppException(ErrorMessage.USER_NOT_FOUND));
    }

    Post getPost(String postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorMessage.POST_NOT_FOUND));
    }

}
