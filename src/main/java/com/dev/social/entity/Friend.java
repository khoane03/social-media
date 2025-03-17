package com.dev.social.entity;

import com.dev.social.utils.enums.FriendEnum;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "tbl_friends")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Friend extends BaseEntity {

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    FriendEnum status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;

    @ManyToOne
    @JoinColumn(name = "friend_id")
    User friend;
}
