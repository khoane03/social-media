package com.dev.social.controller.user;

import com.dev.social.dto.request.user.PostRequest;
import com.dev.social.dto.response.ApiResponseDTO;
import com.dev.social.dto.response.PostResponseDTO;
import com.dev.social.service.user.PostService;
import com.dev.social.utils.constants.AppConst;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/posts")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostController {

    PostService postService;

    @PostMapping()
    public ApiResponseDTO<String> createPost(@ModelAttribute PostRequest req) throws IOException {
        postService.addPost(req);
        return ApiResponseDTO.build(AppConst.SUCCESS);
    }

    @GetMapping()
    public ApiResponseDTO<List<PostResponseDTO>> getAllPosts() {
        return ApiResponseDTO.build(postService.getAllPosts());
    }

    @GetMapping("/user-posts")
    public ApiResponseDTO<List<PostResponseDTO>> getPostsByUser() {
        return ApiResponseDTO.build(postService.getPostsByUser(""));
    }
    @GetMapping("/{id}")
    public ApiResponseDTO<List<PostResponseDTO>> getPostsById(@PathVariable String id) {
        return ApiResponseDTO.build(postService.getPostsByUser(id));
    }

    @DeleteMapping("/{id}")
    public ApiResponseDTO<String> deletePost(@PathVariable String id) {
        postService.deletePost(id);
        return ApiResponseDTO.build(AppConst.SUCCESS);
    }
}
