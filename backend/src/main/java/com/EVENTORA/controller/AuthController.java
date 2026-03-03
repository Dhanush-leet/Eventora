package com.EVENTORA.controller;

import com.EVENTORA.domain.RefreshToken;
import com.EVENTORA.domain.User;
import com.EVENTORA.repository.UserRepository;
import com.EVENTORA.security.JwtUtil;
import com.EVENTORA.service.RefreshTokenService;
import com.EVENTORA.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public AuthController(AuthenticationManager authenticationManager, UserService userService,
            RefreshTokenService refreshTokenService, JwtUtil jwtUtil, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.refreshTokenService = refreshTokenService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String name = request.get("name");
        String password = request.get("password");

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }

        userService.registerLocalUser(email, name, password);
        return ResponseEntity.ok(Map.of("message", "User created successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request, HttpServletResponse response) {
        String email = request.get("email");
        String password = request.get("password");

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));

        User user = userRepository.findByEmail(email).orElseThrow();

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String accessToken = jwtUtil.generateToken(user.getEmail(), user.getRole());
        String refreshTokenStr = refreshTokenService.createRefreshToken(user);

        setCookies(response, accessToken, refreshTokenStr);

        return ResponseEntity.ok(Map.of("message", "Logged in successfully"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("eventora_refresh_token".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                }
            }
        }

        if (refreshToken == null) {
            return ResponseEntity.status(403).body("Refresh token missing");
        }

        final String finalRefreshToken = refreshToken;
        return refreshTokenService.findByToken(refreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String accessToken = jwtUtil.generateToken(user.getEmail(), user.getRole());
                    setCookies(response, accessToken, finalRefreshToken);
                    return ResponseEntity.ok(Map.of("message", "Token refreshed"));
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }

    private void setCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        Cookie accessCookie = new Cookie("eventora_access_token", accessToken);
        accessCookie.setHttpOnly(true);
        accessCookie.setPath("/");
        accessCookie.setMaxAge(15 * 60);

        Cookie refreshCookie = new Cookie("eventora_refresh_token", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(7 * 24 * 60 * 60);

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);
    }
}
