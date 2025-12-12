package com.pegasus.hospital.controller;

import com.pegasus.hospital.dto.LoginRequest;
import com.pegasus.hospital.dto.LoginResponse;
import com.pegasus.hospital.dto.Result;
import com.pegasus.hospital.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 认证控制器
 * 
 * 提供统一的登录接口
 * 
 * @author Pegasus Hospital Team
 */
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    /**
     * 统一登录接口
     * 
     * POST /api/auth/login
     * 
     * @param request 登录请求（包含userId, password, userType）
     * @return 登录响应（包含token）
     */
    @PostMapping("/login")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return Result.success("登录成功", response);
    }
}
