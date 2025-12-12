package com.pegasus.hospital.service;

import com.pegasus.hospital.dto.LoginRequest;
import com.pegasus.hospital.dto.LoginResponse;

/**
 * 认证服务接口
 * 
 * @author Pegasus Hospital Team
 */
public interface AuthService {
    
    /**
     * 统一登录接口
     */
    LoginResponse login(LoginRequest request);
}
