package sn.dev.user_service.web.controllers.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import sn.dev.user_service.data.entities.User;
import sn.dev.user_service.services.UserServices;
import sn.dev.user_service.web.controllers.UserControllers;
import sn.dev.user_service.web.dto.requests.LoginRequests;

@RestController
@RequiredArgsConstructor
public class UserControllersImpl implements UserControllers {
    private final UserServices userServices;

    @Override
    @PostMapping("api/users/login")
    public ResponseEntity<String> login(@RequestBody LoginRequests loginRequests) {
        User user = loginRequests.toEntity();
        return ResponseEntity.ok(userServices.login(user));
    }
}
