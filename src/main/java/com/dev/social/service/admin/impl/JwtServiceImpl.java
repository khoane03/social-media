package com.dev.social.service.admin.impl;

import com.dev.social.entity.Blacklist;
import com.dev.social.entity.User;
import com.dev.social.repository.BlacklistRepository;
import com.dev.social.service.admin.JwtService;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Slf4j
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

    BlacklistRepository blacklistRepository;

    @Override
    public Map<String, String> generateToken(UserDetails userDetails) {
        String accessToken = buildToken(new HashMap<>(), userDetails, ACCESS_TOKEN_EXPIRATION_TIME, AppConst.ACCESS_TOKEN);
        String refreshToken = buildToken(new HashMap<>(), userDetails, REFRESH_TOKEN_EXPIRATION_TIME, AppConst.REFRESH_TOKEN);
        Map<String, String> tokens = new HashMap<>();
        tokens.put(AppConst.ACCESS_TOKEN, accessToken);
        tokens.put(AppConst.REFRESH_TOKEN, refreshToken);
        return tokens;
    }

    @Override
    public boolean validateToken(String token, UserDetails userDetails, boolean isRefreshToken) {
        String tokenType = extractClaim(token, claims -> claims.get("type", String.class));
        if (isTokenExpired(token) || !extractUsername(token).equals(userDetails.getUsername())){
            return false;
        }
        if (blacklistRepository.existsByTokenId(extractClaim(token, Claims::getId))) {
            return false;
        }
        return isRefreshToken ? AppConst.REFRESH_TOKEN.equals(tokenType) : AppConst.ACCESS_TOKEN.equals(tokenType);
    }

    @Override
    public String refreshToken(String refreshToken, UserDetails userDetails) {
        if (!validateToken(refreshToken, userDetails, true)) {
            throw new AppException(ErrorMessage.INVALID_TOKEN);
        }
        String token = buildToken(new HashMap<>(), userDetails, ACCESS_TOKEN_EXPIRATION_TIME, AppConst.ACCESS_TOKEN);
        return token;
    }

    @Override
    public void logout(String refreshToken) {
        String tokenId = extractClaim(refreshToken, Claims::getId);
        var expiration = extractClaim(refreshToken, Claims::getExpiration);
        LocalDateTime exp = expiration.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
        blacklistRepository.save(
                Blacklist.builder()
                        .tokenId(tokenId)
                        .exp(exp)
                        .build()
        );
    }

    @Override
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
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

    String buildToken(Map<String, Object> claims, UserDetails userDetails, long expiraionTime, String type) {
        return Jwts.builder()
                .claims(claims)
                .claim("name : ", ((User) userDetails).getName())
                .subject(userDetails.getUsername())
                .issuer("localhost:8080")
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiraionTime))
                .claim("scopes", buildScope((User) userDetails))
                .claim("type", type)
                .id(UUID.randomUUID().toString())
                .signWith(getKey())
                .compact();
    }

    boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }


}
