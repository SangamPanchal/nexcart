package com.nexcart.security;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtAuthFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        if(authHeader != null && authHeader.startsWith("Bearer ")){
            token = authHeader.substring(7);
            try{
                username = jwtUtil.extractUsername(token);
            } catch (Exception e) {
                System.out.println("Invalid or Expired JWT Token");
            }
        }
//        If we got a username, and Spring doesn't already know about this user...
        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){
            if(jwtUtil.validateToken(token)){

//                Load the user from the database to get their actual roles
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                System.out.println("💥 THE ROLES FOR THIS USER ARE: " + userDetails.getAuthorities());

//                We pass the username, null for password (since we already trust the token), and an empty list of roles.
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request,response);

    }
}
