package com.dev.social.repository;

import com.dev.social.entity.Blacklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlacklistRepository extends JpaRepository<Blacklist, String> {
    boolean existsByTokenId(String tokenId);
}
