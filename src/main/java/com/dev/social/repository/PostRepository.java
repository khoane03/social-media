package com.dev.social.repository;

import com.dev.social.dto.result.PostResult;
import com.dev.social.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, String> {
    @Query(value = "select p.id as postId," +
            "       p.user.id as userId," +
            "       u.name as name, " +
            "       u.avatarUrl as avatarUrl , " +
            "       u.isVerified as verified, " +
            "       p.contents as contents," +
            "       p.createdAt as createdAt," +
            "       img.imageUrl as imageUrl " +
            "FROM Post p " +
            "JOIN p.images img " +
            "JOIN p.user u ")
    List<PostResult> getAllPosts();

    @Query("""
            SELECT
               p.id as postId,
               p.user.id as userId,
               u.name as name,
               u.avatarUrl as avatarUrl ,
               u.isVerified as verified,
               p.contents as contents,
               p.createdAt as createdAt,
               img.imageUrl as imageUrl
            FROM Post p
               JOIN p.images img
               JOIN p.user u
            WHERE p.user.id IN (
                    SELECT f.friend.id FROM Friend f
                    WHERE f.user.id = :currentUserId AND f.status = 'ACCEPTED'
            
                    UNION
            
                    SELECT f.user.id FROM Friend f
                    WHERE f.friend.id = :currentUserId AND f.status = 'ACCEPTED')
                 OR p.user.id = :currentUserId
            """)
    List<PostResult> getFriendsPosts(@Param("currentUserId") String currentUserId);

    @Query(value = "select p.id as postId," +
            "       p.user.id as userId," +
            "       u.name as name, " +
            "       u.avatarUrl as avatarUrl , " +
            "       u.isVerified as verified, " +
            "       p.contents as contents," +
            "       p.createdAt as createdAt," +
            "       img.imageUrl as imageUrl " +
            "FROM Post p " +
            "JOIN p.images img " +
            "JOIN p.user u " +
            "WHERE p.id = :userId")
    List<PostResult> getPostsByUserId(@Param("userId") String userId);

    @Query(value = "select p.id as postId," +
            "       p.user.id as userId," +
            "       u.name as name, " +
            "       u.avatarUrl as avatarUrl , " +
            "       u.isVerified as verified, " +
            "       p.contents as contents," +
            "       p.createdAt as createdAt," +
            "       img.imageUrl as imageUrl " +
            "FROM Post p " +
            "JOIN p.images img " +
            "JOIN p.user u " +
            "WHERE p.id = :postId")
    List<PostResult> getPostById(@Param("postId") String postId);

}
