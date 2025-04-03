package com.dev.social.utils.mapping;

import com.dev.social.dto.response.FriendResponseDTO;
import com.dev.social.dto.response.ReactionDetail;
import com.dev.social.dto.response.ReactionResponseDto;
import com.dev.social.dto.result.FriendResult;
import com.dev.social.dto.result.PostResult;
import com.dev.social.dto.response.PostResponseDTO;
import com.dev.social.entity.Reaction;
import com.dev.social.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
@Slf4j
public class MapUtils {

    UserRepository userRepository;

    public List<PostResponseDTO> mapPost(List<PostResult> postResults) {
        Map<String, PostResponseDTO> postResponseDTOMap = new LinkedHashMap<>();
        for (PostResult post : postResults) {
            PostResponseDTO postResponseDTO = postResponseDTOMap.computeIfAbsent(post.getPostId(),
                    postId -> new PostResponseDTO(post));
            if (post.getImageUrl() != null) {
                postResponseDTO.getImages().add(post.getImageUrl());
            }
        }
        return new ArrayList<>(postResponseDTOMap.values());
    }

    public List<FriendResponseDTO> mapFriend(List<FriendResult> req) {
        List<String> friendIds = req.stream()
                .map(FriendResult::getFriendId)
                .toList();
        return userRepository.findAllById(friendIds)
                .stream()
                .map(FriendResponseDTO::new)
                .collect(Collectors.toList());
    }

    public ReactionResponseDto mapReaction(List<Reaction> reactions) {
        if (reactions == null || reactions.isEmpty()) {
            return new ReactionResponseDto(null);
        }

        String postId = reactions.get(0).getPost().getId();
        ReactionResponseDto dto = new ReactionResponseDto(postId);

        reactions.forEach(reaction -> {
            dto.getReactions().add(new ReactionDetail(reaction));
        });
        dto.setTotalReactions(reactions.size());
        return dto;
    }

}
