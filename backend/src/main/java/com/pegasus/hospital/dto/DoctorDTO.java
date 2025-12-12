package com.pegasus.hospital.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * 医生信息DTO（用于导入和管理）
 * 
 * @author Pegasus Hospital Team
 */
@Data
public class DoctorDTO {
    
    /**
     * 医生ID（8位数字）
     */
    @Pattern(regexp = "^\\d{8}$", message = "医生ID必须是8位数字")
    private String doctorId;
    
    /**
     * 姓名（最多20个字符）
     */
    @NotBlank(message = "姓名不能为空")
    @Size(max = 20, message = "姓名最多20个字符")
    private String name;
    
    /**
     * 密码（不少于4位）
     */
    @Size(min = 4, message = "密码不能少于4位")
    private String password;
    
    /**
     * 科室ID
     */
    private Long deptId;
    
    /**
     * 科室名称（用于Excel导入）
     */
    private String deptName;
    
    /**
     * 专长描述（最多200个字符）
     */
    @Size(max = 200, message = "专长描述最多200个字符")
    private String specialty;
}
