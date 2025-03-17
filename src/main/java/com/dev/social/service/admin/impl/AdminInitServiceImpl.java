package com.dev.social.service.admin.impl;

import com.dev.social.entity.Role;
import com.dev.social.entity.User;
import com.dev.social.repository.RolesRepository;
import com.dev.social.repository.UserRepository;
import com.dev.social.service.admin.AdminInitService;
import com.dev.social.utils.constants.AppConst;
import com.dev.social.utils.enums.RolesEnum;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class AdminInitServiceImpl implements AdminInitService {

    @Value("${define.admin.name}")
    String name;

    @Value("${define.admin.username}")
    String username;

    @Value("${define.admin.password}")
    String password;

    @Value("${define.admin.phone}")
    String phone;

    @Value("${define.admin.email}")
    String email;

    final PasswordEncoder passwordEncoder;
    final UserRepository userRepository;
    final RolesRepository rolesRepository;

    @Override
    @Transactional
    public void initDefaultAdmin() {
        if (!userRepository.existsByUsername(username)) {
            Role adminRole = rolesRepository.findByRoleName(RolesEnum.ROLE_ADMIN.name())
                    .orElseGet(() -> rolesRepository.save(Role.builder()
                            .roleName(RolesEnum.ROLE_ADMIN.name())
                            .build()));
            userRepository.save(User.builder()
                    .name(name)
                    .username(username)
                    .phone(phone)
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .roles(new HashSet<>(Set.of(adminRole)))
                    .status(AppConst.ACTIVE)
                    .isVerified(true)
                    .build());
            log.warn("The default administrator account has been created: User Name : 0986869999, Password : admin");
            log.warn("Please change the password after logging in for the first time");
        }
    }
}
