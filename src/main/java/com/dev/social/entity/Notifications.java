package com.dev.social.entity;

import com.dev.social.utils.enums.NotificationEnum;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "tbl_notifications")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Notifications extends BaseEntity {

    @Column(name = "contents")
    String contents;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    NotificationEnum status;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    User user;

}
