package com.nexcart.repository;

import com.nexcart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByUserEmail(String userEmail);

    Boolean existsByUsername(String username);

    Boolean existsByUserEmail(String userEmail);
}