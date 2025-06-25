package sn.dev.user_service.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import sn.dev.user_service.data.entities.User;
import sn.dev.user_service.data.entities.UserPrincipal;
import sn.dev.user_service.data.repositories.UserRepositories;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepositories userRepositories;

    @Override
    public UserDetails loadUserByUsername(String mail) throws UsernameNotFoundException {
//        System.out.println(mail);
//        User user = userRepository.findUserByUsername(username);
        User user = userRepositories.findUserByEmail(mail);

        if (user == null) {
            System.out.println("User Not Found");
            throw new UsernameNotFoundException("username not found");
        }

        return new UserPrincipal(user);
    }
}
