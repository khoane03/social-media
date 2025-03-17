package com.dev.social.controller.user;

import com.dev.social.dto.request.user.UpdateUserInfo;
import com.dev.social.dto.response.ApiResponseDTO;
import com.dev.social.service.user.InfoService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user-info")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InfoController {

    InfoService infoService;

    @PutMapping()
    public ApiResponseDTO<String> updateInfo(@RequestBody UpdateUserInfo req){
        infoService.updateInfo(req);
        return ApiResponseDTO.build();
    }

}
