package sn.dev.user_service.web.controllers;

import org.springframework.http.ResponseEntity;
import sn.dev.user_service.web.dto.requests.LoginRequests;


public interface UserControllers {
    ResponseEntity<String> login(LoginRequests loginRequests);
/*
    ResponseEntity<UserResponses> register(UserRequests userRequests);
    ResponseEntity<List<UserResponses>> allUsers();
    ResponseEntity<UserResponses> oneUser(String id);
*/

}
