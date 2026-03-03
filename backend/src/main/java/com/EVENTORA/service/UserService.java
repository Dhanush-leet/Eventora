package com.EVENTORA.service;

import com.EVENTORA.domain.User;
import com.EVENTORA.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
            @org.springframework.context.annotation.Lazy PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void registerLocalUser(String email, String name, String password) {
        String encodedPassword = passwordEncoder.encode(password);
        User user = User.builder()
                .email(email)
                .name(name)
                .passwordHash(encodedPassword)
                .provider("LOCAL")
                .role("USER")
                .isVerified(false)
                .lastLogin(LocalDateTime.now())
                .build();
        userRepository.save(user);
    }

    public User findOrCreateGoogleUser(String email, String name, String avatar) {
        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            // Update fields that might have changed in Google
            user.setName(name);
            user.setProfileImageUrl(avatar);
            user.setLastLogin(LocalDateTime.now());
            return userRepository.save(user);
        }

        User newUser = User.builder()
                .email(email)
                .name(name)
                .profileImageUrl(avatar)
                .provider("GOOGLE")
                .role("USER")
                .isVerified(true) // Google-authenticated emails are pre-verified
                .lastLogin(LocalDateTime.now())
                .build();
        return userRepository.save(newUser);
    }
}
