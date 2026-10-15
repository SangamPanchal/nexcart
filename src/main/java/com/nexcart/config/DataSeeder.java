package com.nexcart.config;

import com.nexcart.model.Role;
import com.nexcart.model.User;
import com.nexcart.repository.RoleRepository;
import com.nexcart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_USERNAME:admin}")
    private String adminUsername;

    @Value("${ADMIN_PASSWORD:admin123}")
    private String adminPassword;

    @Value("${ADMIN_EMAIL:admin@nexcart.com}")
    private String adminEmail;

    public DataSeeder(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Ensure ROLE_ADMIN and ROLE_USER exist
        Role adminRole = roleRepository.findByRoleName("ROLE_ADMIN").orElseGet(() -> {
            Role role = new Role();
            role.setRoleName("ROLE_ADMIN");
            return roleRepository.save(role);
        });

        Role userRole = roleRepository.findByRoleName("ROLE_USER").orElseGet(() -> {
            Role role = new Role();
            role.setRoleName("ROLE_USER");
            return roleRepository.save(role);
        });

        // 2. Ensure initial Admin account exists
        if (userRepository.findByUsername(adminUsername).isEmpty()) {
            User admin = new User();
            admin.setUsername(adminUsername);
            admin.setUserEmail(adminEmail);
            admin.setUserPassword(passwordEncoder.encode(adminPassword));
            admin.getRoles().add(adminRole);
            admin.getRoles().add(userRole);
            userRepository.save(admin);
            System.out.println("✅ Initial Admin created: username=" + adminUsername + ", email=" + adminEmail);
        }
    }
}
