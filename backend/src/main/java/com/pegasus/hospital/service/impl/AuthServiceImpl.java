package com.pegasus.hospital.service.impl;

import com.pegasus.hospital.dto.LoginRequest;
import com.pegasus.hospital.dto.LoginResponse;
import com.pegasus.hospital.entity.Admin;
import com.pegasus.hospital.exception.BusinessException;
import com.pegasus.hospital.mapper.AdminMapper;
import com.pegasus.hospital.service.AuthService;
import com.pegasus.hospital.service.DoctorService;
import com.pegasus.hospital.service.PatientService;
import com.pegasus.hospital.util.JwtUtil;
import com.pegasus.hospital.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 认证服务实现类
 * 
 * @author Pegasus Hospital Team
 */
@Service
public class AuthServiceImpl implements AuthService {
    
    @Autowired
    private PatientService patientService;
    
    @Autowired
    private DoctorService doctorService;
    
    @Autowired
    private AdminMapper adminMapper;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    public LoginResponse login(LoginRequest request) {
        String userType = request.getUserType().toLowerCase();
        
        switch (userType) {
            case "patient":
                return patientService.login(request.getUserId(), request.getPassword());
                
            case "doctor":
                return doctorService.login(request.getUserId(), request.getPassword());
                
            case "admin":
                return adminLogin(request.getUserId(), request.getPassword());
                
            default:
                throw new BusinessException("不支持的用户类型：" + userType);
        }
    }
    
    private LoginResponse adminLogin(String username, String password) {
        Admin admin = adminMapper.selectByUsername(username);
        if (admin == null) {
            throw new BusinessException("管理员账号不存在");
        }
        
        if (!PasswordUtil.matches(password, admin.getPassword())) {
            throw new BusinessException("密码错误");
        }
        
        String token = jwtUtil.generateToken(admin.getUsername(), "admin", admin.getName());
        
        return LoginResponse.builder()
                .token(token)
                .userId(admin.getUsername())
                .name(admin.getName())
                .userType("admin")
                .build();
    }
}
