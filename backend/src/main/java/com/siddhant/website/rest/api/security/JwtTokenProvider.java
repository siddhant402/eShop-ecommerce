package com.siddhant.website.rest.api.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtTokenProvider {
    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${app.jwt.secret:}")
    private String jwtSecret;
    @Value("${app.jwt.expiration-ms:604800000}")
    private long jwtExpirationInMs;

    private SecretKey signingKey;

    @PostConstruct
    void init() {
        if (jwtSecret == null || jwtSecret.isBlank()) {
            signingKey = Jwts.SIG.HS256.key().build();
            log.warn("JWT_SECRET is not set: using a random key. Tokens become invalid on restart.");
        } else {
            signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
        }
    }

    // Generate token
    public String generateToken(Authentication authentication){
        String username = authentication.getName();
        Date currentDate = new Date();
        Date expiryDate = new Date(currentDate.getTime() + jwtExpirationInMs);
        String token = Jwts.builder()
                .subject(username)
                .issuedAt(currentDate)
                .expiration(expiryDate)
                .signWith(key())
                .compact();
        return token;
    }

    private Key key(){
        return signingKey;
    }

    // get username from token
    public String getUsernameFromToken(String token){
        return Jwts
                .parser()
                .verifyWith((SecretKey)key() )
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();

    }

    // validate token
    /**
     * token expire
     * invalid token
     * unsupported token
     * jwt claims is null or empty
     * **/
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith((SecretKey) key())
                    .build()
                    .parse(token);
            return true;
        } catch (MalformedJwtException ex) {
            throw new MalformedJwtException("Invalid token");
        } catch (ExpiredJwtException ex) {
            throw new ExpiredJwtException(null, null, "Token expired");
        } catch (UnsupportedJwtException ex) {
            throw new UnsupportedJwtException("Unsupported token");
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("JWT claims string is empty");
        } catch (Exception ex) {
            throw new RuntimeException("Invalid token");
        }
    }
}
