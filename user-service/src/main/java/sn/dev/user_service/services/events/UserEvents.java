package sn.dev.user_service.services.events;

import lombok.RequiredArgsConstructor;
import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import sn.dev.user_service.data.entities.User;

@Component
@RepositoryEventHandler
@RequiredArgsConstructor
public class UserEvents {
    private final PasswordEncoder passwordEncoder;

    @HandleBeforeCreate
    public void handleUserCreate(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
    }
}
