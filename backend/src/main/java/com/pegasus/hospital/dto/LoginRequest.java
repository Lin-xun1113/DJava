package com.pegasus.hospital.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 登录请求DTO
 * 
 * @author Pegasus Hospital Team
 */
@Data
public class LoginRequest {
    
    /**
     * 用户ID（患者ID/医生ID/管理员用户名）
     */
    @NotBlank(message = "用户ID不能为空")
    private String userId;
    
    /**
     * 密码
     */
    @NotBlank(message = "密码不能为空")
    @Size(min = 4, message = "密码不能少于4位")
    private String password;
    
    /**
     * 用户类型：patient-患者，doctor-医生，admin-管理员
     */
    @NotBlank(message = "用户类型不能为空")
    private String userType;
}
