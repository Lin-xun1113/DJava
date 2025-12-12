package com.pegasus.hospital.dto;

import lombok.Data;
import lombok.Builder;

/**
 * 登录响应DTO
 * 
 * @author Pegasus Hospital Team
 */
@Data
@Builder
public class LoginResponse {
    
    /**
     * JWT令牌
     */
    private String token;
    
    /**
     * 用户ID
     */
    private String userId;
    
    /**
     * 用户姓名
     */
    private String name;
    
    /**
     * 用户类型
     */
    private String userType;
}
