package sn.dev.user_service.web.controllers;

import org.springframework.http.ResponseEntity;
import sn.dev.user_service.web.dto.requests.LoginRequests;
import sn.dev.user_service.web.dto.responses.LoginResponse;


public interface UserControllers {
    ResponseEntity<LoginResponse> login(LoginRequests loginRequests);
}
