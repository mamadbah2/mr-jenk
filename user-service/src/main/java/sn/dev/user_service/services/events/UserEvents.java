package sn.dev.user_service.services.events;

import lombok.AllArgsConstructor;
import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.HandleBeforeDelete;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import sn.dev.user_service.data.entities.User;
import sn.dev.user_service.data.entities.UserPrincipal;
import sn.dev.user_service.data.repositories.UserRepositories;
import sn.dev.user_service.exceptions.ForbiddenException;
import sn.dev.user_service.exceptions.UserAlreadyExistsException;

import java.util.Objects;
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

    @HandleBeforeDelete
    public void handleUserDelete(User user) {
        System.out.println("User a suppr : ");
        System.out.println(user.getId());
        System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) auth.getPrincipal();
        String userId = jwt.getClaimAsString("userID");
        System.out.println("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

        if (!Objects.equals(userId, user.getId())) {
            throw new ForbiddenException("User n'est pas authoriser");
        }

    }
}
