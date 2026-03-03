package com.EVENTORA.service;

import com.EVENTORA.domain.RefreshToken;
import com.EVENTORA.domain.User;
import com.EVENTORA.repository.RefreshTokenRepository;
import com.EVENTORA.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public String createRefreshToken(User user) {
        // Optional: delete existing refresh token for the user
        // refreshTokenRepository.deleteByUser(user);

        Optional<RefreshToken> existing = refreshTokenRepository.findByUser(user);
        if (existing.isPresent()) {
            RefreshToken token = existing.get();
            token.setToken(UUID.randomUUID().toString());
            token.setExpiryDate(LocalDateTime.now().plusDays(7));
            return refreshTokenRepository.save(token).getToken();
        }

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(LocalDateTime.now().plusDays(7))
                .build();

        return refreshTokenRepository.save(refreshToken).getToken();
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException(
                    token.getToken() + " Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    @Transactional
    public int deleteByUserId(User user) {
        return refreshTokenRepository.deleteByUser(user);
    }
}
