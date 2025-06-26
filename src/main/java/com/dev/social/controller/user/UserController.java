package com.dev.social.controller.user;

import com.dev.social.configuration.WebSocketEventListener;
import com.dev.social.dto.response.ApiResponseDTO;
import com.dev.social.dto.response.UserResponseDTO;
import com.dev.social.service.user.UserService;
import com.dev.social.utils.constants.AppConst;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    UserService userService;

    @GetMapping("/all")
    public ApiResponseDTO<?> getAllUser(@RequestParam(defaultValue = "1") int pageIndex,
                                                            @RequestParam(defaultValue = "10") int pageSize){
        return ApiResponseDTO.of(userService.getAllUser(pageIndex, pageSize));
    }

    @GetMapping()
    public ApiResponseDTO<UserResponseDTO> getInfo(){
        return ApiResponseDTO.of(userService.getInfo());
    }

    @GetMapping("/{id}")
    public ApiResponseDTO<UserResponseDTO> getInfoById(@PathVariable(name = "id") String id){
        return ApiResponseDTO.of(userService.getInfoById(id));
    }

    @PutMapping("/updateImage")
    public ApiResponseDTO<String> updateImage(@RequestParam(name = "type") String type,
                                              @RequestParam(name = "file") MultipartFile file) throws IOException {
        userService.updateImage(file,type);
        return ApiResponseDTO.of(AppConst.UPDATE_SUCCESS);
    }

    @PutMapping("/status/{id}")
    public ApiResponseDTO<String> updateStatus(@PathVariable(name = "id") String id){
        userService.setStatus(id);
        return ApiResponseDTO.of(AppConst.UPDATE_SUCCESS);
    }

    @PutMapping("/verification/{id}")
    public ApiResponseDTO<String> updateVerification(@PathVariable(name = "id") String id){
        userService.setVerification(id);
        return ApiResponseDTO.of(AppConst.UPDATE_SUCCESS);
    }

    @GetMapping("/online")
    public ApiResponseDTO<Set<String>> getOnlineUsers() {
        return ApiResponseDTO.of(WebSocketEventListener.getOnlineUsers());
    }

    @DeleteMapping("/{id}")
    public ApiResponseDTO<String> deleteUser(@PathVariable(name = "id") String id){
        userService.deleteUserById(id);
        return ApiResponseDTO.of(AppConst.SUCCESS);
    }

    @GetMapping("/search")
    public ApiResponseDTO<List<UserResponseDTO>> searchUser(@RequestParam String keyword){
        return ApiResponseDTO.of(userService.searchUser(keyword));
    }

    @GetMapping("/count")
    public ApiResponseDTO<Integer> countUser(@RequestParam String status) {
        return ApiResponseDTO.of(userService.countUserByStatus(status));
    }
}
