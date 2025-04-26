package com.dev.social.service.user;

import com.dev.social.dto.request.user.PostRequest;
import com.dev.social.dto.response.PostResponseDTO;
import com.dev.social.entity.Post;

import java.io.IOException;
import java.util.List;

public interface PostService {
    void addPost(PostRequest request) throws IOException;

    List<PostResponseDTO> getAllPosts();

    List<PostResponseDTO> getFriendPost();

    List<PostResponseDTO> getPostsByUser(String postId);

    List<PostResponseDTO> getPostById(String postId);

    void deletePost(String id);

    void updatePost(Post post);
}
