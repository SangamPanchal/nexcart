package com.nexcart.controller;

import com.nexcart.model.Role;
import com.nexcart.model.User;
import com.nexcart.repository.RoleRepository;
import com.nexcart.repository.UserRepository;
import com.nexcart.security.AuthRequest;
import com.nexcart.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    public AuthController(JwtUtil jwtUtil, AuthenticationManager authenticationManager, UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    @PostMapping("/register")
    public String register(@RequestBody AuthRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return "Error: Username already exist!!";
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setUserEmail(request.getEmail());

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        newUser.setUserPassword(hashedPassword);

        Role userRole = roleRepository.findByRoleName("ROLE_USER").orElseGet(() -> {
            Role newRole = new Role();
            newRole.setRoleName("ROLE_USER");
            return roleRepository.save(newRole);
        });

        newUser.getRoles().add(userRole);
        userRepository.save(newUser);

        return "User registered successfully.";
    }

    @PostMapping("/login")
    public String login(@RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            User user = userRepository.findByUsername(request.getUsername()).orElse(null);
            List<String> roles = user != null
                    ? user.getRoles().stream().map(Role::getRoleName).toList()
                    : List.of("ROLE_USER");

            return jwtUtil.generateToken(request.getUsername(), roles);
        } catch (AuthenticationException e) {
            throw new RuntimeException("Invalid username or password!!");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        return userRepository.findByUsername(principal.getName())
                .map(u -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("username", u.getUsername());
                    map.put("email", u.getUserEmail());
                    map.put("roles", u.getRoles().stream().map(Role::getRoleName).toList());
                    return ResponseEntity.ok(map);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/test")
    public String test() {
        return "Hello";
    }
}
