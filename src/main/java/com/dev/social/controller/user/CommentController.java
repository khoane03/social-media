package com.dev.social.controller.user;

import com.dev.social.dto.result.CommentResult;
import com.dev.social.dto.request.user.CommentRequestDTO;
import com.dev.social.dto.response.ApiResponseDTO;
import com.dev.social.service.user.CommentService;
import com.dev.social.utils.constants.AppConst;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/comment")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentController {

    CommentService commentService;

    @PostMapping()
    public ApiResponseDTO<?> addComment(@RequestBody CommentRequestDTO req) {
        commentService.addComment(req);
        return ApiResponseDTO.of(AppConst.SUCCESS);
    }

    @GetMapping("/{id}")
    public ApiResponseDTO<List<CommentResult>> getCommentsByPostId(@PathVariable("id") String id) {
        return ApiResponseDTO.of(commentService.getCommentsByPostId(id));
    }

    @DeleteMapping("/{cmtId}")
    public ApiResponseDTO<String> deleteComment(@PathVariable("cmtId") String cmtId) {
        commentService.deleteComment(cmtId);
        return ApiResponseDTO.of(AppConst.SUCCESS);
    }
}
