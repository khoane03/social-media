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
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Slf4j
public class FriendServiceImpl implements FriendService {

    FriendRepository friendRepository;
    UserRepository userRepository;
    UserService userService;
    MapUtils mapUtils;


    @Override
    public void sendFriendRequest(String receiverId) {
        User sender = userService.getCurrentUser();
        if (sender.getId().equals(receiverId)) throw new AppException(ErrorMessage.SAME_USER);
        //Check if the other person has sent you a friend request
        Optional<Friend> existingFriendRequested = friendRepository.findByUserIdAndFriendId(sender.getId(), receiverId);
        if (existingFriendRequested.isPresent()) {
            handleExistingFriend(existingFriendRequested.get());
            return;
        }
        //Check to see if you've sent a friend request to someone else
        //cancel
        Optional<Friend> reverseFriend = friendRepository.findByUserIdAndFriendId(receiverId, sender.getId());
        if (reverseFriend.isPresent()) {
            handleReverseFriend(reverseFriend.get());
            return;
        }
        createNewFriendRequest(sender, receiverId);
    }

    @Override
    public void acceptFriendRequest(String friendId) {
        String userId = userService.getCurrentUser().getId();
        friendRepository.findByUserIdAndFriendId(userId, friendId)
                .ifPresentOrElse(friend -> {
                    if (FriendEnum.REQUESTED.equals(friend.getStatus())) {
                        friend.setStatus(FriendEnum.ACCEPTED);
                        friendRepository.save(friend);
                    }
                }, () -> {
                    throw new AppException(ErrorMessage.BAD_REQUEST);
                });
    }

    @Override
    public void unfriend(String friendId) {
        String userId = userService.getCurrentUser().getId();
        friendRepository.findByUserIdAndFriendId(userId, friendId)
                .ifPresentOrElse(friend -> {
                    if (FriendEnum.ACCEPTED.equals(friend.getStatus())) {
                        friendRepository.deleteById(friend.getId());
                    }
                }, () -> {
                    friendRepository.findByUserIdAndFriendId(friendId, userId)
                            .ifPresentOrElse(friend -> {
                                if (FriendEnum.ACCEPTED.equals(friend.getStatus())) {
                                    friendRepository.deleteById(friend.getId());
                                }
                            }, () -> {
                                throw new AppException(ErrorMessage.BAD_REQUEST);
                            });
                });

    }

    @Override
    public void block(String friendId) {
        log.warn("Blocking friend with id: {}", friendId);
        String userId = userService.getCurrentUser().getId();
        friendRepository.findByUserIdAndFriendId(userId, friendId)
                .ifPresentOrElse(friend -> {
                    if (FriendEnum.ACCEPTED.equals(friend.getStatus())) {
                        friend.setStatus(FriendEnum.BLOCKED);
                        friendRepository.save(friend);
                    }
                    if (FriendEnum.BLOCKED.equals(friend.getStatus())) {
                        friendRepository.deleteById(friend.getId());
                    }
                }, () -> {
                    throw new AppException(ErrorMessage.BAD_REQUEST);
                });

    }

    @Override
    public List<FriendResponseDTO> getAllFriends() {
        var user = userService.getCurrentUser();
        return mapUtils.mapFriend(friendRepository.getAllFriends(user.getId()));
    }

    @Override
    public List<FriendResponseDTO> getAllFriendsBlock() {
        String userId = userService.getCurrentUser().getId();
        return mapUtils.mapFriend(friendRepository.getAllFriendsBlock(userId));
    }

    @Override
    public List<FriendResponseDTO> getAllFriendsRequest() {
        String userId = userService.getCurrentUser().getId();
        return mapUtils.mapFriend(friendRepository.getAllFriendsRequest(userId));
    }

    @Override
    public List<FriendResponseDTO> getSuggestionFriends() {
        String userId = userService.getCurrentUser().getId();
        return mapUtils.mapFriend(friendRepository.getSuggestionFriends(userId));
    }

    void handleExistingFriend(Friend friend) {
        if (FriendEnum.REQUESTED.equals(friend.getStatus())) {
            friend.setStatus(FriendEnum.ACCEPTED);
            friendRepository.save(friend);
        }
    }

    void handleReverseFriend(Friend friend) {
        if (FriendEnum.REQUESTED.equals(friend.getStatus())) {
            friendRepository.deleteById(friend.getId());
        }
    }

    void createNewFriendRequest(User sender, String receiverId) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new AppException(ErrorMessage.USER_NOT_FOUND));

        friendRepository.save(Friend.builder()
                .user(receiver)
                .friend(sender)
                .status(FriendEnum.REQUESTED)
                .build());
    }

}
