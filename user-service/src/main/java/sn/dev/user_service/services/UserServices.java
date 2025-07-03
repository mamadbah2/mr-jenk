package sn.dev.user_service.services;

import sn.dev.user_service.data.entities.User;


public interface UserServices {
    String login(User user);
    User findByEmail(String email);
}
