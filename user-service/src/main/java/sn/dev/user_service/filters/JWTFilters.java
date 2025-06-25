package sn.dev.user_service.filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import sn.dev.user_service.services.JWTServices;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JWTFilters extends OncePerRequestFilter {
    private final JWTServices jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String subject = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                subject = jwtService.extractSubject(token);
            } catch (Exception e) {
                logger.debug("Mauvais token : " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

        if (subject != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Neanmoins on le charge a travers le mail
            UserDetails userDetails = userDetailsService.loadUserByUsername(subject);

            if (jwtService.validateToken(token, userDetails)){
                UsernamePasswordAuthenticationToken token1 =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                token1.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(token1);
            }
        }

        filterChain.doFilter(request, response);
    }
}
