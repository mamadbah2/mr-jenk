package sn.dev.user_service.services;

import io.jsonwebtoken.Claims;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Date;
import java.util.function.Function;

public interface JWTServices {
    String generateToken(String username);

    String extractSubject(String token);

    boolean validateToken(String token, UserDetails userDetails);

    <T> T extractClaim(String token, Function<Claims, T> claimResolver);

    Claims extractAllClaims(String token);

    boolean isTokenExpired(String token);

    Date extractExpiration(String token);
}
