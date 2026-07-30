package com.nexcart.service;

import com.nexcart.model.User;
import com.nexcart.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found" + username));

        System.out.println("🕵️ LOGGING IN AS USER ID: " + user.getUserId() + " | USERNAME: " + user.getUsername());

        List<GrantedAuthority> authorities =
                user.getRoles().stream()
                        .map(role -> new org.springframework.security.core.authority.SimpleGrantedAuthority(role.getRoleName()))
                        .collect(java.util.stream.Collectors.toList());

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getUserPassword(),
                authorities
        );
    }
}
