package com.dev.social.dto.response;

import com.dev.social.entity.Role;
import com.dev.social.entity.User;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponseDTO {
    String id;
    String name;
    String username;
    String status;
    String avatarUrl;
    String coverUrl;
    boolean isVerifier;
    String email;
    String phone;
    LocalDate dob;
    long age;
    String address;
    String gender;
    Set<String> role;

    public UserResponseDTO(User user) {
        if (user != null) {
            this.setId(user.getId());
            this.setName(user.getName());
            this.setUsername(user.getUsername());
            this.setStatus(user.getStatus());
            this.setVerifier(user.isVerified());
            this.setEmail(user.getEmail());
            this.setPhone(user.getPhone());
            this.setAvatarUrl(user.getAvatarUrl());
            this.setCoverUrl(user.getCoverUrl());
            this.role = user.getRoles()
                    .stream()
                    .map(Role::getRoleName)
                    .collect(Collectors.toSet());
            if (user.getInfo() != null) {
                this.setDob(user.getInfo().getDob());
                if(user.getInfo().getDob() != null){
                    this.setAge(ChronoUnit.YEARS.between(user.getInfo().getDob(), LocalDate.now()));
                }
                this.setAddress(user.getInfo().getAddress());
                this.setGender(user.getInfo().getGender());
            }
        }
    }
}
