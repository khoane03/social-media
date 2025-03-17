package com.dev.social.repository;

import com.dev.social.dto.result.PostResult;
import com.dev.social.entity.Post;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, String> {
    @Query(value = "select p.id as postId," +
            "       p.user_id," +
            "       u.name, " +
            "       u.avatar_url as avatarUrl, " +
            "       u.is_verified as verified, " +
            "       p.contents," +
            "       p.created_at," +
            "       pm.image_url " +
            "FROM tbl_posts p " +
            "LEFT JOIN tbl_posts_images pm on p.id = pm.post_id " +
            "LEFT JOIN tbl_users u on p.user_id = u.id " +
            "ORDER BY p.created_at DESC ",
            nativeQuery = true)
    List<PostResult> getPosts();

    @Query(value = "select p.id as postId," +
            "       p.user_id," +
            "       u.name, " +
            "       u.avatar_url as avatarUrl, " +
            "       u.is_verified as verified, " +
            "       p.contents," +
            "       p.created_at," +
            "       pm.image_url " +
            "FROM tbl_posts p " +
            "LEFT JOIN tbl_posts_images pm on p.id = pm.post_id " +
            "LEFT JOIN tbl_users u on p.user_id = u.id " +
            "WHERE p.user_id = :userId",
            nativeQuery = true)
    List<PostResult> getPostsByUserId(@Param("userId") String userId);

}
