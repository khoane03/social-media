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
        return ApiResponseDTO.of(friendService.getAllFriends());
    }

    @GetMapping("/pending")
    public ApiResponseDTO<List<FriendResponseDTO>> getFriendReq() {
        return ApiResponseDTO.of(friendService.getAllFriendsRequest());
    }

    @GetMapping("/block")
    public ApiResponseDTO<List<FriendResponseDTO>> getFriendBlock() {
        return ApiResponseDTO.of(friendService.getAllFriendsBlock());
    }

    @GetMapping("/suggest")
    public ApiResponseDTO<List<FriendResponseDTO>> getSuggest() {
        return ApiResponseDTO.of(friendService.getSuggestionFriends());
    }

    @PostMapping("/send-request")
    public ApiResponseDTO<String> sendFriendRequest(@RequestParam String receiverId) {
        friendService.sendFriendRequest(receiverId);
        return ApiResponseDTO.of(FriendConst.SEND_SUCCESS);
    }

    @PostMapping("/accept-request")
    public ApiResponseDTO<String> acceptFriendRequest(@RequestParam String friendId) {
        friendService.acceptFriendRequest(friendId);
        return ApiResponseDTO.of(FriendConst.ACCEPT_SUCCESS);
    }

    @PostMapping("/unfriend")
    public ApiResponseDTO<String> unfriend(@RequestParam String friendId) {
        friendService.unfriend(friendId);
        return ApiResponseDTO.of(FriendConst.UNFRIEND_SUCCESS);
    }

    @PostMapping("/block")
    public ApiResponseDTO<String> block(@RequestParam String friendId) {
        friendService.block(friendId);
        return ApiResponseDTO.of(FriendConst.BLOCK_SUCCESS);
    }

    @PostMapping("/check-status")
    public ApiResponseDTO<String> check(@RequestParam String friendId){
        return ApiResponseDTO.of(friendService.checkStatusFriend(friendId));
    }

}
