package com.dev.social.service.auth.impl;

import com.dev.social.dto.request.auth.LoginRequestDTO;
import com.dev.social.dto.request.auth.PasswordRecoveryRequestDTO;
import com.dev.social.dto.request.auth.RegisterRequestDTO;
import com.dev.social.dto.request.auth.TokenRequestDTO;
import com.dev.social.dto.response.AuthResponseDTO;
import com.dev.social.entity.Role;
import com.dev.social.entity.User;
import com.dev.social.repository.RolesRepository;
import com.dev.social.repository.UserRepository;
import com.dev.social.service.admin.JwtService;
import com.dev.social.service.auth.AuthenticationService;
import com.dev.social.utils.constants.AppConst;
import com.dev.social.utils.enums.RolesEnum;
import com.dev.social.utils.exception.AppException;
import com.dev.social.utils.exception.ErrorMessage;
import com.dev.social.utils.validation.RegisterValidate;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationServiceImpl implements AuthenticationService {

    JwtService jwtService;
    PasswordEncoder passwordEncoder;
    AuthenticationManager authenticationManager;
    UserRepository userRepository;
    RolesRepository rolesRepository;
    RegisterValidate validate;

    @Override
    public AuthResponseDTO login(LoginRequestDTO loginRequestDTO) {
        try {
            var user = userRepository.findByUsername(loginRequestDTO.getUsername())
                    .orElseThrow(() -> new AppException(ErrorMessage.INCORRECT_USERNAME_OR_PASSWORD));
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequestDTO.getUsername(), loginRequestDTO.getPassword()));
            Map<String, String> tokens = jwtService.generateToken(user);
            return AuthResponseDTO.builder()
                    .accessToken(tokens.get(AppConst.ACCESS_TOKEN))
                    .refreshToken(tokens.get(AppConst.REFRESH_TOKEN))
                    .authenticated(true)
                    .build();
        } catch (BadCredentialsException ignored) {
            throw new AppException(ErrorMessage.INCORRECT_USERNAME_OR_PASSWORD);
        }
    }

    @Override
    public void logout(String token) {
        jwtService.logout(token);
    }

    @Override
    public AuthResponseDTO refreshToken(TokenRequestDTO token) {
        var userDetails = userRepository.findByUsername(jwtService.extractUsername(token.getRefreshToken()))
                .orElseThrow(() -> new AppException(ErrorMessage.ACC_NOT_FOUND));

        return AuthResponseDTO.builder()
                .accessToken(jwtService.refreshToken(token.getRefreshToken(), userDetails))
                .build();
    }

    @Override
    public void registerUser(RegisterRequestDTO registerRequestDTO) {
        validate.isValidRegister(registerRequestDTO);
        Role role = rolesRepository.findByRoleName(RolesEnum.ROLE_USER.name())
                .orElseGet(() -> rolesRepository.save(Role.builder()
                        .roleName(RolesEnum.ROLE_USER.name())
                        .build()));
        userRepository.save(User.builder()
                .name(registerRequestDTO.getName())
                .username(registerRequestDTO.getUsername())
                .password(passwordEncoder.encode(registerRequestDTO.getPassword()))
                .email(registerRequestDTO.getEmail())
                .phone(registerRequestDTO.getPhone())
                .roles(new HashSet<>(Set.of(role)))
                .status(AppConst.ACTIVE)
                .build());
    }

    @Override
    public void passwordRecovery(PasswordRecoveryRequestDTO req) {
        validate.checkPassMatch(req.getPassword(), req.getConfirmPassword());
        userRepository.save(User.builder()
                .password(passwordEncoder.encode(req.getPassword()))
                .build());
    }
}
