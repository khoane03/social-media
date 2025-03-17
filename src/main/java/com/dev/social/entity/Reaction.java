package com.dev.social.entity;

import com.dev.social.utils.enums.ReactionTypeEnum;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "tbl_reaction")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Reaction extends BaseEntity {

    @Column(name = "reaction_type")
    @Enumerated(EnumType.STRING)
    ReactionTypeEnum reactionType;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    Post post;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

}
