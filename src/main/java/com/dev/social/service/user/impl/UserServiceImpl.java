package com.dev.social.service.user.impl;

import com.dev.social.dto.response.UserResponseDTO;
import com.dev.social.entity.User;
import com.dev.social.repository.UserRepository;
import com.dev.social.service.admin.CloudinaryService;
import com.dev.social.service.user.UserService;
import com.dev.social.utils.constants.AppConst;
import com.dev.social.utils.enums.ImageEnum;
import com.dev.social.utils.exception.AppException;
import com.dev.social.utils.exception.ErrorMessage;
import com.dev.social.utils.validation.EnumValidate;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    UserRepository userRepository;
    CloudinaryService cloudinaryService;

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public Page<UserResponseDTO> getAllUser(int pageIndex, int pageSize) {
        Sort sort = Sort.by(Sort.Direction.DESC, AppConst.UPDATED_AT);
        Pageable page = PageRequest.of(pageIndex - 1, pageSize, sort);
        return userRepository.findAll(page)
                .map(UserResponseDTO::new);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void setStatus(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorMessage.USER_NOT_FOUND));

        String newStatus = AppConst.ACTIVE.equals(user.getStatus()) ? AppConst.LOCK : AppConst.ACTIVE;
        user.setStatus(newStatus);
        userRepository.save(user);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void setVerification(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorMessage.USER_NOT_FOUND));

        user.setVerified(!user.isVerified());
        userRepository.save(user);
    }

    @Override
    public UserResponseDTO getInfo() {
        return new UserResponseDTO(getCurrentUser());
    }

    @Override
    public UserResponseDTO getInfoById(String id) {
        return new UserResponseDTO(userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorMessage.USER_NOT_FOUND)));
    }

    @Override
    public void updateImage(MultipartFile file, String type) throws IOException {
        ImageEnum imageEnum = EnumValidate.isValidEnum(ImageEnum.class, type, ErrorMessage.INVALID_TYPE);
        User user = getCurrentUser();
        String imageUrl = cloudinaryService.uploadImage(file);

        switch (imageEnum) {
            case AVATAR -> updateAvatar(user, imageUrl);
            case COVER -> updateCover(user, imageUrl);
            default -> throw new AppException(ErrorMessage.BAD_REQUEST);
        }

    }

    @Override
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
            String username = authentication.getName();
            return userRepository.findByUsername(username)
                    .orElseThrow(() -> new AppException(ErrorMessage.USER_NOT_FOUND));
        }
        throw new AppException(ErrorMessage.UNAUTHORIZED);
    }

    void updateAvatar(User user, String imageUrl) {
        if (!imageUrl.equals(user.getAvatarUrl())) {
            user.setAvatarUrl(imageUrl);
        }
    }

    void updateCover(User user, String imageUrl) {
        if (!imageUrl.equals(user.getCoverUrl())) {
            user.setCoverUrl(imageUrl);
        }
    }

}
