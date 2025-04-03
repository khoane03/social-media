package com.dev.social.service.user.impl;

import com.dev.social.dto.response.FriendResponseDTO;
import com.dev.social.entity.Friend;
import com.dev.social.entity.User;
import com.dev.social.repository.FriendRepository;
import com.dev.social.repository.UserRepository;
import com.dev.social.service.user.FriendService;
import com.dev.social.service.user.UserService;
import com.dev.social.utils.enums.FriendEnum;
import com.dev.social.utils.exception.AppException;
import com.dev.social.utils.exception.ErrorMessage;
import com.dev.social.utils.mapping.MapUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class FriendServiceImpl implements FriendService {

    final FriendRepository friendRepository;
    final UserRepository userRepository;
    final UserService userService;
    final MapUtils mapUtils;

    @Override
    public void sendFriendRequest(String receiverId) {
        User sender = userService.getCurrentUser();
        if (sender.getId().equals(receiverId)) throw new AppException(ErrorMessage.SAME_USER);

        friendRepository.findByUserIdAndFriendId(sender.getId(), receiverId)
                .ifPresentOrElse(
                        friend -> {
                            if (friend.getStatus() == FriendEnum.REQUESTED) updateStatus(friend, FriendEnum.ACCEPTED);
                        },
                        () -> friendRepository.findByUserIdAndFriendId(receiverId, sender.getId())
                                .ifPresentOrElse(
                                        friend -> {
                                            if (friend.getStatus() == FriendEnum.REQUESTED)
                                                friendRepository.deleteById(friend.getId());
                                        },
                                        () -> createFriendRequest(sender, receiverId))
                );
    }

    @Override
    public void acceptFriendRequest(String friendId) {
        processFriendRequest(getCurrentUserId(), friendId, FriendEnum.REQUESTED, FriendEnum.ACCEPTED, false);
    }

    @Override
    public void unfriend(String friendId) {
        String userId = getCurrentUserId();
        friendRepository.findByUserIdAndFriendId(userId, friendId)
                .ifPresentOrElse(friend -> {
                    if (FriendEnum.ACCEPTED.equals(friend.getStatus()) || FriendEnum.REQUESTED.equals(friend.getStatus())) {
                        friendRepository.deleteById(friend.getId());
                    }
                }, () -> {
                    friendRepository.findByUserIdAndFriendId(friendId, userId)
                            .ifPresentOrElse(friend -> {
                                if (FriendEnum.ACCEPTED.equals(friend.getStatus()) || FriendEnum.REQUESTED.equals(friend.getStatus())) {
                                    friendRepository.deleteById(friend.getId());
                                }
                            }, () -> {
                                throw new AppException(ErrorMessage.BAD_REQUEST);
                            });
                });
    }

    @Override
    public void block(String friendId) {
        processFriendRequest(getCurrentUserId(), friendId, null, FriendEnum.BLOCKED, true);
    }

    @Override
    public List<FriendResponseDTO> getAllFriends() {
        return mapUtils.mapFriend(friendRepository.getAllFriends(getCurrentUserId()));
    }

    @Override
    public List<FriendResponseDTO> getAllFriendsBlock() {
        return mapUtils.mapFriend(friendRepository.getAllFriendsBlock(getCurrentUserId()));
    }

    @Override
    public List<FriendResponseDTO> getAllFriendsRequest() {
        return mapUtils.mapFriend(friendRepository.getAllFriendsRequest(getCurrentUserId()));
    }

    @Override
    public List<FriendResponseDTO> getSuggestionFriends() {
        return mapUtils.mapFriend(friendRepository.getSuggestionFriends(getCurrentUserId()));
    }

    @Override
    public String checkStatusFriend(String friendId) {
        String userId = getCurrentUserId();
        var friend = friendRepository.findByUserIdAndFriendId(userId, friendId)
                .or(() -> friendRepository.findByUserIdAndFriendId(friendId, userId))
                .orElse(null);
        return friend != null ? friend.getStatus().name() : null;
    }

    String getCurrentUserId() {
        return userService.getCurrentUser().getId();
    }

    void createFriendRequest(User sender, String receiverId) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new AppException(ErrorMessage.USER_NOT_FOUND));
        friendRepository.save(Friend.builder()
                .user(receiver)
                .friend(sender)
                .status(FriendEnum.REQUESTED)
                .build());
    }

    void processFriendRequest(String userId, String friendId, FriendEnum expectedStatus, FriendEnum newStatus, boolean allowDelete) {
        processFriend(userId, friendId, expectedStatus, newStatus, allowDelete)
                .or(() -> processFriend(friendId, userId, expectedStatus, newStatus, allowDelete))
                .orElseThrow(() -> new AppException(ErrorMessage.BAD_REQUEST));
    }

    Optional<Friend> processFriend(String userId, String friendId, FriendEnum expectedStatus, FriendEnum newStatus, boolean allowDelete) {
        return friendRepository.findByUserIdAndFriendId(userId, friendId)
                .filter(friend -> expectedStatus == null || expectedStatus.equals(friend.getStatus()))
                .map(friend -> {
                    if (allowDelete && newStatus.equals(friend.getStatus())) {

                        friendRepository.deleteById(friend.getId());
                    } else {

                        updateStatus(friend, newStatus, userId, friendId);
                    }
                    return friend;
                });
    }

    void updateStatus(Friend friend, FriendEnum newStatus, String... ids) {
        friend.setStatus(newStatus);
        if (ids.length == 2) {
            friend.setUser(userRepository.findById(ids[0]).orElseThrow(() -> new AppException(ErrorMessage.USER_NOT_FOUND)));
            friend.setFriend(userRepository.findById(ids[1]).orElseThrow(() -> new AppException(ErrorMessage.USER_NOT_FOUND)));
        }
        friendRepository.save(friend);
    }
}