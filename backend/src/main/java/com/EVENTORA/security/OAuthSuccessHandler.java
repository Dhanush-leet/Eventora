package com.EVENTORA.security;

import com.EVENTORA.domain.User;
import com.EVENTORA.service.RefreshTokenService;
import com.EVENTORA.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuthSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;

    public OAuthSuccessHandler(JwtUtil jwtUtil, UserService userService, RefreshTokenService refreshTokenService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.refreshTokenService = refreshTokenService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        String avatar = oauthUser.getAttribute("picture");

        User user = userService.findOrCreateGoogleUser(email, name, avatar);

        String accessToken = jwtUtil.generateToken(user.getEmail(), user.getRole());
        String refreshToken = refreshTokenService.createRefreshToken(user);

        Cookie accessCookie = new Cookie("eventora_access_token", accessToken);
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(false); // set true in production
        accessCookie.setPath("/");
        accessCookie.setMaxAge(15 * 60); // 15 minutes

        Cookie refreshCookie = new Cookie("eventora_refresh_token", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(false);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(7 * 24 * 60 * 60); // 7 days

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);

        response.sendRedirect("http://localhost:5173/");
    }
}
