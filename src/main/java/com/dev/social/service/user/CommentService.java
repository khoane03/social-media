package com.dev.social.service.user;

import com.dev.social.dto.result.CommentResult;
import com.dev.social.dto.request.user.CommentRequestDTO;

import java.util.List;

public interface CommentService {
    void addComment(CommentRequestDTO comment);
    void deleteComment(String commentId);
    List<CommentResult> getCommentsByPostId(String postId);
}
