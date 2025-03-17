package com.dev.social.service.user;

import com.dev.social.dto.response.UserResponseDTO;
import com.dev.social.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

public interface UserService {
    List<UserResponseDTO> getAllUser(int pageIndex, int pageSize);

    UserResponseDTO getInfo();

    UserResponseDTO getInfoById(String id);

    void updateImage(MultipartFile file, String type) throws IOException;

    void setStatus(String id);

    void setVerification(String id);

    User getCurrentUser();

}
