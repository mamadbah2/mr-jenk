package sn.dev.user_service.services;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import sn.dev.user_service.data.entities.User;
import sn.dev.user_service.data.repositories.UserRepositories;
import sn.dev.user_service.services.impl.UserServicesImpl;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class UserServicesIntegrationTest {
    @Autowired
    private UserServicesImpl userServices;

    @Autowired
    private UserRepositories userRepositories;

    @Test
    void testFindByEmail_UserFound() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password");

        Optional<User> existingUser = userRepositories.findByEmail("test@example.com");
        existingUser.ifPresent(value -> userRepositories.delete(value));
        // GIVEN
        userRepositories.save(user);

        // WHEN
        User foundUser = userServices.findByEmail("test@example.com");

        // THEN
        assertNotNull(foundUser);
        assertEquals("test@example.com", foundUser.getEmail());
    }

    @Test
    void findAllUsers_ReturnsAllSavedUsers() {

        // When
        List<User> allUsers = userServices.findAllUsers();

        // Then
        assertFalse(allUsers.isEmpty(), "La liste devrait contenir au moins 1 user");
    }
}
