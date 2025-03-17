package com.dev.social.controller.user;

import com.dev.social.dto.response.ApiResponseDTO;
import com.dev.social.dto.response.FriendResponseDTO;
import com.dev.social.service.user.FriendService;
import com.dev.social.utils.constants.FriendConst;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/friend")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FriendController {

    FriendService friendService;

    @GetMapping("")
    public ApiResponseDTO<List<FriendResponseDTO>> getFriends() {
        return ApiResponseDTO.build(friendService.getAllFriends());
    }

    @GetMapping("/pending")
    public ApiResponseDTO<List<FriendResponseDTO>> getFriendReq() {
        return ApiResponseDTO.build(friendService.getAllFriendsRequest());
    }

    @GetMapping("/block")
    public ApiResponseDTO<List<FriendResponseDTO>> getFriendBlock() {
        return ApiResponseDTO.build(friendService.getAllFriendsBlock());
    }

    @GetMapping("/suggest")
    public ApiResponseDTO<List<FriendResponseDTO>> getSuggest() {
        return ApiResponseDTO.build(friendService.getSuggestionFriends());
    }

    @PostMapping("/send-request")
    public ApiResponseDTO<String> sendFriendRequest(@RequestParam String receiverId) {
        friendService.sendFriendRequest(receiverId);
        return ApiResponseDTO.build(FriendConst.SEND_SUCCESS);
    }

    @PostMapping("/accept-request")
    public ApiResponseDTO<String> acceptFriendRequest(@RequestParam String friendId) {
        friendService.acceptFriendRequest(friendId);
        return ApiResponseDTO.build(FriendConst.ACCEPT_SUCCESS);
    }

    @PostMapping("/unfriend")
    public ApiResponseDTO<String> unfriend(@RequestParam String friendId) {
        friendService.unfriend(friendId);
        return ApiResponseDTO.build(FriendConst.UNFRIEND_SUCCESS);
    }

    @PostMapping("/block")
    public ApiResponseDTO<String> block(@RequestParam String friendId) {
        friendService.block(friendId);
        return ApiResponseDTO.build(FriendConst.BLOCK_SUCCESS);
    }



}
