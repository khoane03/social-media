package com.dev.social.configuration;

import com.dev.social.entity.Post;
import com.dev.social.repository.PostRepository;
import com.dev.social.utils.exception.AppException;
import com.dev.social.utils.exception.ErrorMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.expression.method.MethodSecurityExpressionOperations;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("authz")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthorizationLogic {

    final PostRepository postRepository;

    public boolean isOwner(Authentication authentication, String owner) {
        if (authentication == null || owner.isEmpty()) {
            return false;
        }
        return authentication.getName().equals(owner);
    }

    public boolean isOwnerPost(Authentication authentication, String postId) {
        var post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorMessage.POST_NOT_FOUND));
        return isOwner(authentication, post.getUser().getUsername());
    }
}

