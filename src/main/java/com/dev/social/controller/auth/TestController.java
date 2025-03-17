package com.dev.social.controller.auth;

import com.dev.social.repository.FriendRepository;
import com.dev.social.repository.ReactionRepository;
import com.dev.social.service.admin.CloudinaryService;
import com.dev.social.service.user.CommentService;
import com.dev.social.service.user.FriendService;
import com.dev.social.service.user.ReactionService;
import com.dev.social.service.user.PostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class TestController {

    CloudinaryService cloudinaryService;
    PostService postService;
    CommentService commentService;
    ReactionService reactionService;
    ReactionRepository reactionRepository;
    FriendService friendService;
    FriendRepository friendRepository;


    @GetMapping("/f/{id}")
    public ResponseEntity<?> getPosts(@PathVariable String id) {
        return ResponseEntity.ok(friendRepository.getAllFriends(id));
    }

    @PostMapping("/friend")
    public ResponseEntity<?> friend(@RequestParam String id) {
        friendService.block(id);
        return ResponseEntity.ok("accept success");
    }

    @PostMapping("/friends")
    public ResponseEntity<?> friends(@RequestParam String id) {
        friendService.sendFriendRequest(id);
        return ResponseEntity.ok("success");
    }

    @PostMapping("/feel")
    public ResponseEntity<?> feel(@RequestParam String postId, @RequestParam String feelType) {
        reactionService.makeFeel(postId, feelType);
        return ResponseEntity.ok("success");
    }

    @GetMapping("/feel")
    public ResponseEntity<?> feels() {
        return ResponseEntity.ok(reactionRepository.countReactionsGroupedByType());
    }

    @PostMapping("/test0")
    public ResponseEntity<String> test(@RequestParam MultipartFile file) throws Exception {
        return ResponseEntity.ok(cloudinaryService.uploadImage(file));
    }

    @PostMapping("/test1")
    public ResponseEntity<String> test1(@RequestBody String url) throws Exception {
        return cloudinaryService.deleteImage(url) ? ResponseEntity.ok("success") : ResponseEntity.ok("fail");
    }




    @GetMapping("/{id}")
    public ResponseEntity<?> getComment(@PathVariable String id) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(id));
    }

//    @GetMapping("/test")
//    public ResponseEntity<?> test() {
//        return ResponseEntity.ok(postService.getPostsByUser());
//    }


}
