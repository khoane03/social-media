package com.dev.social.service.admin.impl;

import com.dev.social.entity.User;
import com.dev.social.service.admin.JwtService;
import com.dev.social.service.admin.TokenService;
import com.dev.social.utils.constants.AppConst;
import com.dev.social.utils.exception.AppException;
import com.dev.social.utils.exception.ErrorMessage;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JwtServiceImpl implements JwtService {

    @Value("${define.security.jwt.secret}")
    @NonFinal
    String SECRET_KEY;

    @Value("${define.security.jwt.access-token.expiration}")
    @NonFinal
    long ACCESS_TOKEN_EXPIRATION_TIME;

    @Value("${define.security.jwt.refresh-token.expiration}")
    @NonFinal
    long REFRESH_TOKEN_EXPIRATION_TIME;

    @Value("${spring.data.redis.time-to-live}")
    @NonFinal
    long TIME_TO_LIVE;


    TokenService tokenService;

    @Override
    public Map<String, String> generateToken(UserDetails userDetails) {
        String accessToken = buildToken(new HashMap<>(), userDetails, ACCESS_TOKEN_EXPIRATION_TIME);
        String refreshToken = buildToken(new HashMap<>(), userDetails, REFRESH_TOKEN_EXPIRATION_TIME);
        tokenService.saveToken(AppConst.ACCESS_TOKEN + " : " + userDetails.getUsername(), accessToken, TIME_TO_LIVE);
        tokenService.saveToken(AppConst.REFRESH_TOKEN + " : " + userDetails.getUsername(), refreshToken);
        Map<String, String> tokens = new HashMap<>();
        tokens.put(AppConst.ACCESS_TOKEN, accessToken);
        tokens.put(AppConst.REFRESH_TOKEN, refreshToken);
        return tokens;
    }

    @Override
    public boolean validateAccessToken(String token, UserDetails userDetails) {
        return (tokenService.tokenExists(AppConst.ACCESS_TOKEN + " : " + userDetails.getUsername())
                && tokenService.getToken(AppConst.ACCESS_TOKEN + " : " + userDetails.getUsername()).equals(token)
                && !isTokenExpired(token)
                && extractUsername(token).equals(userDetails.getUsername()));
    }

    @Override
    public String refreshToken(String refreshToken, UserDetails userDetails) {
        if (!validateRefreshToken(refreshToken, userDetails)) {
            throw new AppException(ErrorMessage.INVALID_TOKEN);
        }
        String token = buildToken(new HashMap<>(), userDetails, ACCESS_TOKEN_EXPIRATION_TIME);
        tokenService.saveToken(AppConst.ACCESS_TOKEN + " : " + userDetails.getUsername(), token, TIME_TO_LIVE);
        return token;
    }

    @Override
    public void logout(String token) {
        String username = extractUsername(token);
        tokenService.deleteToken(AppConst.REFRESH_TOKEN + " : " + username);
        tokenService.deleteToken(AppConst.ACCESS_TOKEN + " : " + username);
    }

    @Override
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    boolean validateRefreshToken(String token, UserDetails userDetails) {
        return !isTokenExpired(token) && extractUsername(token).equals(userDetails.getUsername());
    }

    SecretKey getKey() {
        byte[] secret = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(secret);
    }

    String buildScope(User user) {
        StringBuilder scopes = new StringBuilder();
        user.getRoles().forEach(role -> scopes.append(role.getRoleName()).append(" "));
        return scopes.toString().trim();
    }

    <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    String buildToken(Map<String, Object> claims, UserDetails userDetails, long expiraionTime) {
        return Jwts.builder()
                .claims(claims)
                .claim("name : ", ((User) userDetails).getName())
                .subject(userDetails.getUsername())
                .issuer("localhost:8080")
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiraionTime))
                .claim("scopes", buildScope((User) userDetails))
                .signWith(getKey())
                .compact();
    }

    boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }


}
