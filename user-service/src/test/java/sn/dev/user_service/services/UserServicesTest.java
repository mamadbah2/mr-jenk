package sn.dev.user_service.services;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import sn.dev.user_service.data.entities.User;
import sn.dev.user_service.data.repositories.UserRepositories;
import sn.dev.user_service.services.impl.UserServicesImpl;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // active mockito
public class UserServicesTest {
    @Mock
    private UserRepositories userRepositories;

    @Mock
    private JWTServices jwtServices;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private UserServicesImpl userServicesImpl;

    @Test
    void testLogin_SuccessfulAuthentication() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password");

        String expectedToken = "mocked_jwt_token";

        Authentication authentication = Mockito.mock(Authentication.class);
        Mockito.when(authenticationManager.authenticate(Mockito.any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        Mockito.when(authentication.isAuthenticated()).thenReturn(true);

        Mockito.when(jwtServices.generateToken(Mockito.any(Authentication.class), Mockito.isNull())).thenReturn(expectedToken);

        String result = userServicesImpl.login(user);

        Assertions.assertEquals(expectedToken, result);
        Mockito.verify(authenticationManager, Mockito.times(1)).authenticate(Mockito.any(UsernamePasswordAuthenticationToken.class));
        Mockito.verify(jwtServices, Mockito.times(1)).generateToken(Mockito.any(Authentication.class), Mockito.isNull());
    }


    @Test
    void login_InvalidCredentials_ThrowsAuthenticationException() {
        // Given
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password");

        // Mocking behavior for a failed authentication
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new AuthenticationCredentialsNotFoundException("Invalid username or password"));

        // When / Then
        assertThrows(AuthenticationCredentialsNotFoundException.class, () -> userServicesImpl.login(user));
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtServices, never()).generateToken(any(), any()); // Should not generate token
    }

    @Test
    void login_AuthenticationNotAuthenticated_ReturnsFail() {
        // Given
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password");
        Authentication authentication = mock(Authentication.class);

        // Mocking behavior where authentication succeeds but is not authenticated
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(false);

        // When
        String result = userServicesImpl.login(user);

        // Then
        assertEquals("fail", result);
        verify(jwtServices, never()).generateToken(any(), any());
    }

    @Test
    void findByEmail_UserExists_ReturnsUser() {
        // Given
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password");
        when(userRepositories.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        // When
        User foundUser = userServicesImpl.findByEmail("test@example.com");

        // Then
        assertNotNull(foundUser);
        assertEquals("test@example.com", foundUser.getEmail());
    }

    @Test
    void findByEmail_UserNotFound_ThrowsException() {
        // Given
        when(userRepositories.findByEmail("non-existent@example.com")).thenReturn(Optional.empty());

        // When / Then
        assertThrows(AuthenticationCredentialsNotFoundException.class, () -> userServicesImpl.findByEmail("non-existent@example.com"));
    }

    @Test
    void findById_UserExists_ReturnsUser() {
        // Given
        User user = new User();
        user.setId("user-id-123");
        when(userRepositories.findById("user-id-123")).thenReturn(Optional.of(user));

        // When
        User foundUser = userServicesImpl.findById("user-id-123");

        // Then
        assertNotNull(foundUser);
        assertEquals("user-id-123", foundUser.getId());
    }

    @Test
    void findById_UserNotFound_ThrowsException() {
        // Given
        when(userRepositories.findById("non-existent-id")).thenReturn(Optional.empty());

        // When / Then
        assertThrows(AuthenticationCredentialsNotFoundException.class, () -> userServicesImpl.findById("non-existent-id"));
    }

    @Test
    void findAllUsers_ReturnsAllUsers() {
        User userA = new User();
        userA.setEmail("test@example.com");
        userA.setPassword("password");

        User userB = new User();
        userB.setEmail("test1@example.com");
        userB.setPassword("password");
        // Given
        List<User> userList = Arrays.asList(userA, userB);
        when(userRepositories.findAll()).thenReturn(userList);

        // When
        List<User> foundUsers = userServicesImpl.findAllUsers();

        // Then
        assertEquals(2, foundUsers.size());
        assertEquals("test@example.com", foundUsers.get(0).getEmail());
    }

}




