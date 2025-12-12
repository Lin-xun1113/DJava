package com.pegasus.hospital.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 预约挂号请求DTO
 * 
 * @author Pegasus Hospital Team
 */
@Data
public class AppointmentRequest {
    
    /**
     * 患者ID（从token中获取，可选）
     */
    private String patientId;
    
    /**
     * 医生ID
     */
    @NotBlank(message = "医生ID不能为空")
    @Pattern(regexp = "^\\d{8}$", message = "医生ID格式不正确（8位数字）")
    private String doctorId;
    
    /**
     * 排班ID
     */
    @NotNull(message = "排班ID不能为空")
    private Long scheduleId;
    
    /**
     * 预约时间（具体到分钟）
     */
    @NotNull(message = "预约时间不能为空")
    private LocalDateTime apptDatetime;
}
