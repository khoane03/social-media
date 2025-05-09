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

    @GetMapping("/{id}")
    public ApiResponseDTO<List<FriendResponseDTO>> getFriends(@PathVariable("id") String id) {
        return ApiResponseDTO.of(friendService.getAllFriends(id));
    }

    @GetMapping("/pending/{id}")
    public ApiResponseDTO<List<FriendResponseDTO>> getFriendReq(@PathVariable("id") String id) {
        return ApiResponseDTO.of(friendService.getAllFriendsRequest(id));
    }

    @GetMapping("/block/{id}")
    public ApiResponseDTO<List<FriendResponseDTO>> getFriendBlock(@PathVariable("id") String id) {
        return ApiResponseDTO.of(friendService.getAllFriendsBlock(id));
    }

    @GetMapping("/suggest/{id}")
    public ApiResponseDTO<List<FriendResponseDTO>> getSuggest(@PathVariable("id") String id) {
        return ApiResponseDTO.of(friendService.getSuggestionFriends(id));
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
    public ApiResponseDTO<FriendResponseDTO> check(@RequestParam String friendId){
        return ApiResponseDTO.of(friendService.checkStatusFriend(friendId));
    }

}
