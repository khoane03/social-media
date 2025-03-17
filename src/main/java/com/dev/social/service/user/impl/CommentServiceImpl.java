package com.dev.social.service.user.impl;

import com.dev.social.dto.result.CommentResult;
import com.dev.social.dto.request.user.CommentRequestDTO;
import com.dev.social.entity.Comment;
import com.dev.social.repository.CommentRepository;
import com.dev.social.repository.PostRepository;
import com.dev.social.repository.UserRepository;
import com.dev.social.service.user.CommentService;
import com.dev.social.utils.exception.AppException;
import com.dev.social.utils.exception.ErrorMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class CommentServiceImpl implements CommentService {

    CommentRepository commentRepository;
    UserRepository userRepository;
    PostRepository postRepository;

    @Override
    public void addComment(CommentRequestDTO req) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        commentRepository.save(Comment.builder()
                        .contents(req.getContent())
                        .post(postRepository.findById(req.getPostId())
                                .orElseThrow(() -> new AppException(ErrorMessage.POST_NOT_FOUND)))
                        .user(userRepository.findByUsername(username)
                                .orElseThrow(() -> new AppException(ErrorMessage.USER_NOT_FOUND)))
                .build());
    }

    @Override
    public void deleteComment(String commentId) {
        commentRepository.deleteById(commentId);
    }

    @Override
    public List<CommentResult> getCommentsByPostId(String postId) {
        return commentRepository.getCommentsByPostId(postId);
    }
}
