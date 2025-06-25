package sn.dev.user_service.web.dto.requests;

import jakarta.validation.constraints.Email;
import lombok.Data;
import sn.dev.user_service.data.entities.User;

@Data
public class LoginRequests {
    @Email
    private String email;
    private String password;

    public User toEntity() {
        User user = new User();
        user.setPassword(this.password);
        user.setEmail(this.email);
        return user;
    }
}
