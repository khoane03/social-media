package com.dev.social.repository;

import com.dev.social.entity.User;
import com.dev.social.utils.constants.AppConst;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByPhone(String phone);

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Modifying
    @Transactional
    @Query(value = "UPDATE tbl_users SET " +
            "is_verified = NOT is_verified " +
            "WHERE id = :id",
            nativeQuery = true)
    void setVerification(@Param("id") String id);

    @Transactional
    @Modifying
    @Query(value = "UPDATE tbl_users SET " +
            "status = CASE " +
            "WHEN status = '" + AppConst.ACTIVE + "' THEN '" + AppConst.LOCK + "' " +
            "WHEN status = '" + AppConst.LOCK + "' THEN '" + AppConst.ACTIVE + "' " +
            "END " +
            "WHERE id = :id",
            nativeQuery = true)
    void setStatus(@Param("id") String id);

    @Query(value = "SELECT u.id, " +
            "u.name, " +
            "u.username, " +
            "u.password, " +
            "u.email, " +
            "u.avatar_url , " +
            "u.cover_url, " +
            "u.phone, " +
            "u.status, " +
            "u.is_verified, " +
            "u.created_at, " +
            "u.updated_at " +
            "FROM tbl_users AS u " +
            "LEFT JOIN tbl_info AS i ON i.user_id = u.id " +
            "LEFT JOIN tbl_user_roles AS ur ON ur.user_id = u.id " +
            "LEFT JOIN tbl_roles AS r ON r.id = ur.role_id " +
            "ORDER BY u.created_at " +
            "LIMIT :pageSize OFFSET :pageIndex ",
            nativeQuery = true)
    List<User> getAllUsers(@Param("pageIndex") int pageIndex, @Param("pageSize") int pageSize);

    boolean existsByPhone(String phone);

    boolean existsByUsernameAndPassword(String username, String password);
}
