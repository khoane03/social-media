package com.dev.social.repository;

import com.dev.social.entity.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, String> {
    Optional<Reaction> findByPostIdAndUserId(String postId, String userId);

    @Query(value = "SELECT r.reaction_type, COUNT(r.id) AS total_reactions " +
            "FROM tbl_reaction AS r " +
            "GROUP BY r.reaction_type",
            nativeQuery = true)
    List<Object[]> countReactionsGroupedByType();


}
