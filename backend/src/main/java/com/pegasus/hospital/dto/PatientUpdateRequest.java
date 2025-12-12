package com.pegasus.hospital.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * 患者信息修改请求DTO
 * 注意：患者ID和身份证号不可修改
 * 
 * @author Pegasus Hospital Team
 */
@Data
public class PatientUpdateRequest {
    
    /**
     * 姓名（最多20个字符）
     */
    @Size(max = 20, message = "姓名最多20个字符")
    private String name;
    
    /**
     * 新密码（不少于4位）
     */
    @Size(min = 4, message = "密码不能少于4位")
    private String password;
    
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
