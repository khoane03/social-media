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
        return ApiResponseDTO.of(AppConst.SUCCESS);
    }

    @GetMapping()
    public ApiResponseDTO<List<PostResponseDTO>> getAllPosts() {
        return ApiResponseDTO.of(postService.getAllPosts());
    }

    @GetMapping("/friend-posts")
    public ApiResponseDTO<List<PostResponseDTO>> getFriendPost(){
        return ApiResponseDTO.of(postService.getFriendPost());
    }

    @GetMapping("/user-posts/{userId}")
    public ApiResponseDTO<List<PostResponseDTO>> getPostsByUser(@PathVariable("userId") String userId) {
        return ApiResponseDTO.of(postService.getPostsByUser(userId));
    }
    
    @GetMapping("/{id}")
    public ApiResponseDTO<?> getPostsById(@PathVariable("id") String id) {
        return ApiResponseDTO.of(postService.getPostById(id));
    }

    @DeleteMapping("/{id}")
    public ApiResponseDTO<String> deletePost(@PathVariable String id) {
        postService.deletePostById(id);
        return ApiResponseDTO.of(AppConst.SUCCESS);
    }

    @GetMapping("/count")
    public ApiResponseDTO<Long> countPosts() {
        return ApiResponseDTO.of(postService.countPosts());
    }
}
