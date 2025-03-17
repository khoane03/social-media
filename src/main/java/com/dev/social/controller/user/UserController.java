package com.dev.social.controller.user;

import com.dev.social.dto.response.ApiResponseDTO;
import com.dev.social.dto.response.UserResponseDTO;
import com.dev.social.service.user.UserService;
import com.dev.social.utils.constants.AppConst;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    UserService userService;

    @GetMapping("/all")
    public ApiResponseDTO<List<UserResponseDTO>> getAllUser(@RequestParam(defaultValue = "1") int pageIndex,
                                                            @RequestParam(defaultValue = "10") int pageSize){
        return ApiResponseDTO.build(userService.getAllUser(pageIndex, pageSize));
    }

    @GetMapping()
    public ApiResponseDTO<UserResponseDTO> getInfo(){
        return ApiResponseDTO.build(userService.getInfo());
    }

    @GetMapping("/{id}")
    public ApiResponseDTO<UserResponseDTO> getInfoById(@PathVariable(name = "id") String id){
        return ApiResponseDTO.build(userService.getInfoById(id));
    }

    @PutMapping("/updateImage")
    public ApiResponseDTO<String> updateImage(@RequestParam(name = "type") String type, @RequestParam(name = "file") MultipartFile file) throws IOException {
        userService.updateImage(file,type);
        return ApiResponseDTO.build(AppConst.UPDATE_SUCCESS);
    }

    @PutMapping("/status/{id}")
    public ApiResponseDTO<String> updateStatus(@PathVariable(name = "id") String id){
        userService.setStatus(id);
        return ApiResponseDTO.build(AppConst.UPDATE_SUCCESS);
    }

    @PutMapping("/verification/{id}")
    public ApiResponseDTO<String> updateVerification(@PathVariable(name = "id") String id){
        userService.setVerification(id);
        return ApiResponseDTO.build(AppConst.UPDATE_SUCCESS);
    }
}
