package com.pegasus.hospital.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * 患者注册请求DTO
 * 
 * @author Pegasus Hospital Team
 */
@Data
public class PatientRegisterRequest {
    
    /**
     * 姓名（最多20个字符）
     */
    @NotBlank(message = "姓名不能为空")
    @Size(max = 20, message = "姓名最多20个字符")
    private String name;
    
    /**
     * 密码（不少于4位）
     */
    @NotBlank(message = "密码不能为空")
    @Size(min = 4, message = "密码不能少于4位")
    private String password;
    
    /**
     * 身份证号（18位）
     */
    @NotBlank(message = "身份证号不能为空")
    @Pattern(regexp = "^\\d{17}[\\dXx]$", message = "身份证号格式不正确")
    private String identityId;
    
    /**
     * 手机号
     */
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;
    
    /**
     * 性别：M(男)/F(女)
     */
    @Pattern(regexp = "^[MF]$", message = "性别只能是M(男)或F(女)")
    private String gender;
}
