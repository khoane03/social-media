package com.dev.social.service.user.impl;

import com.dev.social.dto.request.user.NotificationRequestDTO;
import com.dev.social.dto.request.user.ReactionRequest;
import com.dev.social.dto.response.ReactionResponseDto;
import com.dev.social.entity.Reaction;
import com.dev.social.entity.Post;
import com.dev.social.entity.User;
import com.dev.social.repository.ReactionRepository;
import com.dev.social.repository.PostRepository;
import com.dev.social.service.user.NotificationService;
import com.dev.social.service.user.ReactionService;
import com.dev.social.service.user.UserService;
import com.dev.social.utils.constants.AppConst;
import com.dev.social.utils.enums.ReactionTypeEnum;
import com.dev.social.utils.exception.AppException;
import com.dev.social.utils.exception.ErrorMessage;
import com.dev.social.utils.mapping.MapUtils;
import com.dev.social.utils.validation.EnumValidate;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ReactionServiceImpl implements ReactionService {

    ReactionRepository reactionRepository;
    PostRepository postRepository;
    UserService userService;
    MapUtils mapReaction;
    NotificationService notificationService;

    @Override
    public void makeFeel(ReactionRequest req) {
        ReactionTypeEnum feelType = EnumValidate.isValidEnum(ReactionTypeEnum.class, req.getReactionType(), ErrorMessage.INVALID_FEEL_TYPE);
        reactionRepository.findByPostIdAndUserId(req.getPostId(), getUser().getId())
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
                                .post(getPost(req.getPostId()))
                                .user(getUser())
                                .build()));
        // send notification
        notificationService.createNotification(NotificationRequestDTO.builder()
                .userId(getPost(req.getPostId()).getUser().getId())
                .content(AppConst.NEW_REACTION)
                .build());
    }

    @Override
    public ReactionResponseDto getReactionsByPostId(String postId) {
        var reactions = reactionRepository.findByPostId(postId);
        return mapReaction.mapReaction(reactions);
    }

    User getUser() {
        return userService.getCurrentUser();
    }

    Post getPost(String postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorMessage.POST_NOT_FOUND));
    }

}
