package com.nexcart.controller;

import com.nexcart.model.Role;
import com.nexcart.model.User;
import com.nexcart.repository.RoleRepository;
import com.nexcart.repository.UserRepository;
import com.nexcart.security.AuthRequest;
import com.nexcart.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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
            return jwtUtil.generateToken(request.getUsername());
        } catch (AuthenticationException e) {
            throw new RuntimeException("Invalid username or password!!");
        }
    }

    @GetMapping("/test")
    public String test(){
        return "Hello";
    }

}



//    public AuthController(JwtUtil jwtUtil){
//        this.jwtUtil = jwtUtil;
//    }
//    just for testing the hardcoded username password as a demo
//    @PostMapping("/login")
//    public String login(@RequestBody AuthRequest authRequest){
//        if("user".equals(authRequest.getUsername()) && "password".equals(authRequest.getPassword())){
//            return jwtUtil.generateToken(authRequest.getUsername());
//        }else{
//            throw new RuntimeException("Invalid Username or Password!");
//        }
//    }


