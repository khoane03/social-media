package com.dev.social.repository;

import com.dev.social.dto.result.FriendResult;
import com.dev.social.entity.Friend;
import com.dev.social.utils.constants.FriendConst;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRepository extends JpaRepository<Friend, String> {

    Optional<Friend> findByUserIdAndFriendId(String userId, String friendId);

    @Query(value = "SELECT friend_id " +
            " FROM (SELECT DISTINCT " +
            "             CASE" +
            "                 WHEN f.user_id = :userId THEN f.friend_id" +
            "                 ELSE f.user_id" +
            "                 END AS friend_id," +
            "             f.created_at" +
            "         FROM tbl_friends AS f" +
            "         WHERE (f.user_id = :userId OR f.friend_id = :userId)" +
            "           AND f.status = '" + FriendConst.ACCEPTED + "'" +
            "     ) subquery " +
            " ORDER BY subquery.created_at DESC ;",
            nativeQuery = true)
    List<FriendResult> getAllFriends(@Param("userId") String userId);

    @Query(value = "SELECT f.friend_id " +
            "FROM tbl_friends AS f " +
            "WHERE f.user_id = :userId AND f.status = '" + FriendConst.BLOCKED + "'" +
            "ORDER BY f.updated_at",
            nativeQuery = true)
    List<FriendResult> getAllFriendsBlock(@Param("userId") String userId);


    @Query(value = "SELECT f.friend_id " +
            "FROM tbl_friends AS f " +
            "WHERE f.user_id = :userId AND f.status = '" + FriendConst.REQUESTED + "'" +
            "ORDER BY f.updated_at",
            nativeQuery = true)
    List<FriendResult> getAllFriendsRequest(@Param("userId") String userId);

    @Query(value = "SELECT u.id as friend_id " +
            "FROM tbl_users AS u " +
            "WHERE u.id != :userId " +
            " AND NOT EXISTS( " +
            "     SELECT 1 " +
            "       FROM tbl_friends as f " +
            " WHERE ((f.user_id = :userId AND f.friend_id = u.id) " +
            " OR (f.friend_id = :userId AND f.user_id = u.id) " +
            ")" +
            " AND f.status IN ('" + FriendConst.BLOCKED + "', '" + FriendConst.ACCEPTED + "') " +
            ")",
            nativeQuery = true)
    List<FriendResult> getSuggestionFriends(@Param("userId") String userId);

}
