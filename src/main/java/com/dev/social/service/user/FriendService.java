package com.dev.social.service.user;

import com.dev.social.dto.response.FriendResponseDTO;
import com.dev.social.dto.result.FriendResult;

import java.util.List;

public interface FriendService {

    void sendFriendRequest(String receiverId);

    void acceptFriendRequest(String friendId);

    FriendResponseDTO checkStatusFriend(String friendId);

    void unfriend(String friendId);

    void block(String friendId);

    List<FriendResponseDTO> getAllFriends(String userId);

    List<FriendResponseDTO> getAllFriendsBlock(String userId);

    List<FriendResponseDTO> getAllFriendsRequest(String userId);

    List<FriendResponseDTO> getSuggestionFriends(String userId);
}
