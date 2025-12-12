package com.pegasus.hospital.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT工具类
 * 
 * 用于生成和验证JWT令牌
 * 
 * @author Pegasus Hospital Team
 */
@Component
public class JwtUtil {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private Long expiration;
    
    /**
     * 获取签名密钥
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    
    /**
     * 生成JWT令牌
     * 
     * @param userId 用户ID
     * @param userType 用户类型（patient/doctor/admin）
     * @param name 用户姓名
     * @return JWT令牌
     */
    public String generateToken(String userId, String userType, String name) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("userType", userType);
        claims.put("name", name);
        
        return Jwts.builder()
                .claims(claims)
                .subject(userId)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }
    
    /**
     * 解析JWT令牌
     * 
     * @param token JWT令牌
     * @return Claims
     */
    public Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    
    /**
     * 验证令牌是否有效
     */
    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
    
    /**
     * 从令牌中获取用户ID
     */
    public String getUserIdFromToken(String token) {
        Claims claims = parseToken(token);
        return claims.get("userId", String.class);
    }
    
    /**
     * 从令牌中获取用户类型
     */
    public String getUserTypeFromToken(String token) {
        Claims claims = parseToken(token);
        return claims.get("userType", String.class);
    }
    
    /**
     * 从令牌中获取用户姓名
     */
    public String getNameFromToken(String token) {
        Claims claims = parseToken(token);
        return claims.get("name", String.class);
    }
    
    /**
     * 检查令牌是否过期
     */
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = parseToken(token);
            return claims.getExpiration().before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        }
    }
}
