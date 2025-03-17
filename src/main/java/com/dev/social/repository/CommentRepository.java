package com.dev.social.repository;

import com.dev.social.dto.result.CommentResult;
import com.dev.social.entity.Comment;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String> {

    @Query(value = "SELECT cmt.contents," +
            "       cmt.created_at," +
            "       cmt.id as postId, " +
            "       u.name, " +
            "       u.avatar_url as avatarUrl " +
            "FROM tbl_comments as cmt" +
            "         LEFT JOIN tbl_users as u on cmt.user_id = u.id " +
            "WHERE cmt.post_id = :postId",
            nativeQuery = true)
    List<CommentResult> getCommentsByPostId(@Param("postId") String postId);

}
