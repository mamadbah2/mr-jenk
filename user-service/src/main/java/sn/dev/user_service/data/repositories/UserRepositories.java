package sn.dev.user_service.data.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import sn.dev.user_service.data.entities.User;

@RepositoryRestResource(collectionResourceRel = "users", path = "users")
public interface UserRepositories extends MongoRepository<User, String> {
    User findUserByEmail(String email);
}
