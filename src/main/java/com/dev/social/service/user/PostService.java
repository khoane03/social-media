package com.dev.social.service.user;

import com.dev.social.dto.request.user.PostRequest;
import com.dev.social.dto.response.PostResponseDTO;
import com.dev.social.entity.Post;
import com.dev.social.entity.User;

import java.io.IOException;
import java.util.List;

public interface PostService {
    void addPost(PostRequest request) throws IOException;

    List<PostResponseDTO> getAllPosts();

    List<PostResponseDTO> getPostsByUser(String postId);

    void deletePost(String id);

    void updatePost(Post post);
}
