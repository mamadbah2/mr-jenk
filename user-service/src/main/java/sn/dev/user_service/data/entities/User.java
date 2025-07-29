package sn.dev.user_service.data.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Getter
@Setter
public class User {
    @Id
    private String id;
    private String name;
    @Indexed(unique = true)
    private String email;
<<<<<<< Updated upstream
    // @JsonIgnore
=======
//    @JsonIgnore
>>>>>>> Stashed changes
    private String password;
    private Role role;
    private String avatar;
}
