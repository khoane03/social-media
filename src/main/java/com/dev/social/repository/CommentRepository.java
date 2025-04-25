package com.dev.social.repository;

import com.dev.social.dto.result.CommentResult;
import com.dev.social.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String> {

    @Query(value = "SELECT cmt.id as id , " +
            "       cmt.contents as contents ," +
            "       cmt.createdAt as createdAt, " +
            "       cmt.id as postId, " +
            "       u.name as name, " +
            "       u.avatarUrl as avatarUrl " +
            "FROM Comment as cmt " +
            "JOIN cmt.user as u " +
            "WHERE cmt.post.id = :postId")
    List<CommentResult> getCommentsByPostId(@Param("postId") String postId);

}
