package com.dev.social.controller.user;

import com.dev.social.dto.request.user.NotificationRequestDTO;
import com.dev.social.dto.response.ApiResponseDTO;
import com.dev.social.dto.response.NotificationResponseDTO;
import com.dev.social.service.user.NotificationService;
import com.dev.social.utils.constants.AppConst;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notification")
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class NotificationController {

    final NotificationService notificationService;

    @PostMapping
    public ApiResponseDTO<String> createNotification(@RequestBody NotificationRequestDTO req){
        notificationService.createNotification(req);
        return ApiResponseDTO.of(AppConst.SUCCESS);
    }

    @PostMapping("/mark-as-read")
    public ApiResponseDTO<String> maskAsRead(@RequestParam String notificationId){
        notificationService.markAsRead(notificationId);
        return ApiResponseDTO.of(AppConst.SUCCESS);
    }

    @GetMapping("/{id}")
    public ApiResponseDTO<List<NotificationResponseDTO>> getNotification(@PathVariable(name = "id") String id){
        return ApiResponseDTO.of(notificationService.getNotificationsByUserId(id));
    }

    @DeleteMapping("/{id}")
    public ApiResponseDTO<String> deleteNotification(@PathVariable(name = "id") String id){
        notificationService.deleteNotification(id);
        return ApiResponseDTO.of(AppConst.SUCCESS);
    }

}

