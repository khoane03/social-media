package com.dev.social.repository;

import com.dev.social.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RolesRepository extends JpaRepository<Role, String> {
   boolean existsByRoleName(String roleName);

   Optional<Role> findByRoleName(String roleName);
}
