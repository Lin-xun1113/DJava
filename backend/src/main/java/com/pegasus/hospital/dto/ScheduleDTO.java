package com.pegasus.hospital.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * 排班信息DTO（用于导入和管理）
 * 
 * @author Pegasus Hospital Team
 */
@Data
public class ScheduleDTO {
    
    /**
     * 排班ID（更新时使用）
     */
    private Long id;
    
    /**
     * 医生ID
     */
    @NotBlank(message = "医生ID不能为空")
    @Pattern(regexp = "^\\d{8}$", message = "医生ID必须是8位数字")
    private String doctorId;
    
    /**
     * 医生姓名（用于Excel导入）
     */
    private String doctorName;
    
    /**
     * 工作日期
     */
    @NotNull(message = "工作日期不能为空")
    private LocalDate workDate;
    
    /**
     * 开始时间
     */
    @NotNull(message = "开始时间不能为空")
    private LocalTime startTime;
    
    /**
     * 结束时间
     */
    @NotNull(message = "结束时间不能为空")
    private LocalTime endTime;
    
    /**
     * 最大预约数
     */
    @Min(value = 1, message = "最大预约数至少为1")
    private Integer maxPatients = 20;
}
