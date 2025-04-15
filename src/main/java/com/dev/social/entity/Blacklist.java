package com.dev.social.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_blacklist")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Blacklist extends BaseEntity {

    @Column(name = "token_id")
    String tokenId;

    @Column(name = "exp")
    LocalDateTime exp;

}
