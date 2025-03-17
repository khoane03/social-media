package com.dev.social.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Table(name = "tbl_info")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Info extends BaseEntity {
    @Column(name = "date_of_birth")
    LocalDate dob;

    @Column(name = "gender")
    String gender;

    @Column(name = "address")
    String Address;

    @OneToOne
    @JoinColumn(name = "user_id")
    User user;

}
