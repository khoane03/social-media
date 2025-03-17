package com.dev.social.service.user.impl;

import com.dev.social.dto.request.user.PostRequest;
import com.dev.social.dto.response.PostResponseDTO;
import com.dev.social.entity.Post;
import com.dev.social.entity.PostImage;
import com.dev.social.entity.User;
import com.dev.social.repository.PostRepository;
import com.dev.social.service.admin.impl.CloudinaryServiceImpl;
import com.dev.social.service.user.PostService;
import com.dev.social.service.user.UserService;
import com.dev.social.utils.exception.AppException;
import com.dev.social.utils.exception.ErrorMessage;
import com.dev.social.utils.mapping.MapUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PostServiceImpl implements PostService {

    PostRepository postRepository;
    UserService userService;
    CloudinaryServiceImpl cloudinaryService;
    MapUtils mapUtils;

    @Override
    public void addPost(PostRequest request) throws IOException {
        User user = userService.getCurrentUser();
        Post post = createPost(request, user);
        postRepository.save(post);
    }

    @Override
    public List<PostResponseDTO> getAllPosts() {
        return mapUtils.mapPost(postRepository.getPosts());
    }

    @Override
    public List<PostResponseDTO> getPostsByUser(String id) {
        if(id == null || id.isEmpty()) {
            return mapUtils.
                    mapPost(postRepository.getPostsByUserId(userService.getCurrentUser().getId()));
        }
        return mapUtils.
                mapPost(postRepository.getPostsByUserId(id));
    }

    @Override
    public void deletePost(String id) {
        List<String> images = postRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorMessage.POST_NOT_FOUND))
                .getImages()
                .stream()
                .map(PostImage::getImageUrl)
                .toList();
        images.forEach(this::deleteImageSafely);
        postRepository.deleteById(id);
    }

    void deleteImageSafely(String imageUrl) {
        try {
            cloudinaryService.deleteImage(imageUrl);
        } catch (IOException e) {
            log.error("Failed to delete image from Cloudinary: {}", imageUrl, e);
        }
    }

    @Override
    public void updatePost(Post post) {

    }

    Post createPost(PostRequest request, User user) throws IOException {
        Post post = Post.builder()
                .contents(request.getContent())
                .user(user)
                .build();
        if (request.getFiles() != null) {
            List<PostImage> postImages = createPostImages(request.getFiles(), post);
            post.setImages(postImages);
        }
        return post;
    }

    List<PostImage> createPostImages(MultipartFile[] files, Post post) throws IOException {
        return Stream.of(files)
                .map(file -> {
                    try {
                        return PostImage.builder()
                                .imageUrl(cloudinaryService.uploadImage(file))
                                .post(post)
                                .build();
                    } catch (IOException e) {
                        throw new AppException(ErrorMessage.IMAGE_UPLOAD_FAILED);
                    }
                })
                .collect(Collectors.toList());
    }


}
