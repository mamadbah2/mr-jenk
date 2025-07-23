package sn.dev.user_service.services.events;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import sn.dev.user_service.data.entities.User;
import sn.dev.user_service.data.repositories.UserRepositories;
import sn.dev.user_service.exceptions.UserAlreadyExistsException;

import java.util.Optional;

@Component
@RepositoryEventHandler
@AllArgsConstructor
public class UserEvents {
    private final PasswordEncoder passwordEncoder;
    private final UserRepositories userRepositories;

    @HandleBeforeCreate
    public void handleUserCreate(User user) throws Exception {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Optional<User> existingUser = userRepositories.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            throw new UserAlreadyExistsException(user.getEmail());
        }

    }
}
