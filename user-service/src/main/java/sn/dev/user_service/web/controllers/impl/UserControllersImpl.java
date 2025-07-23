package sn.dev.user_service.web.controllers.impl;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import sn.dev.user_service.data.entities.User;
import sn.dev.user_service.services.UserServices;
import sn.dev.user_service.web.controllers.UserControllers;
import sn.dev.user_service.web.dto.requests.LoginRequests;
import sn.dev.user_service.web.dto.responses.LoginResponse;

@RestController
@AllArgsConstructor
public class UserControllersImpl implements UserControllers {
    private final UserServices userServices;
    private final UserDetailsService userDetailsService;

    @Override
    @PostMapping("api/users/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequests loginRequests) {
        String userID = userServices.findByEmail(loginRequests.getEmail()).getId();
        User credentialsUser = loginRequests.toEntity();
        credentialsUser.setId(userID);
        String token = userServices.login(credentialsUser);
        UserDetails userDetails = userDetailsService.loadUserByUsername(credentialsUser.getEmail());
        LoginResponse loginResponse = new LoginResponse(userDetails, token);
        return ResponseEntity.ok(loginResponse);
    }
}
