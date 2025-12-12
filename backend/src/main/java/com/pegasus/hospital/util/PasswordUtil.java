package com.pegasus.hospital.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * 密码加密工具类
 * 
 * 使用SHA-256算法对密码进行加密
 * 
 * @author Pegasus Hospital Team
 */
public class PasswordUtil {
    
    /**
     * SHA-256加密
     * 
     * @param password 原始密码
     * @return 加密后的密码（64位十六进制字符串）
     */
    public static String encrypt(String password) {
        if (password == null || password.isEmpty()) {
            throw new IllegalArgumentException("密码不能为空");
        }
        
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256算法不可用", e);
        }
    }
    
    /**
     * 验证密码
     * 
     * @param rawPassword 原始密码
     * @param encodedPassword 加密后的密码
     * @return 是否匹配
     */
    public static boolean matches(String rawPassword, String encodedPassword) {
        if (rawPassword == null || encodedPassword == null) {
            return false;
        }
        return encrypt(rawPassword).equals(encodedPassword);
    }
    
    /**
     * 字节数组转十六进制字符串
     */
    private static String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
