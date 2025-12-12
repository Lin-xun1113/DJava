package com.pegasus.hospital.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

/**
 * 预约实体类
 * 
 * 预约号：12位数字（唯一）- 格式：YYYYMMDD + 4位序号
 * 患者ID、医生ID
 * 预约时间段（具体到分钟）
 * 状态（已预约、已取消、已完成）
 * 
 * @author Pegasus Hospital Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@TableName("appointment")
public class Appointment {
    
    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 预约号（12位数字）
     */
    private String apptId;
    
    /**
     * 患者ID
     */
    private String patientId;
    
    /**
     * 医生ID
     */
    private String doctorId;
    
    /**
     * 排班ID
     */
    private Long scheduleId;
    
    /**
     * 预约时间（精确到分钟）
     */
    private LocalDateTime apptDatetime;
    
    /**
     * 状态：已预约/已取消/已完成
     */
    private String status;
    
    /**
     * 取消原因
     */
    private String cancelReason;
    
    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    /**
     * 患者姓名（非数据库字段）
     */
    @TableField(exist = false)
    private String patientName;
    
    /**
     * 医生姓名（非数据库字段）
     */
    @TableField(exist = false)
    private String doctorName;
    
    /**
     * 科室名称（非数据库字段）
     */
    @TableField(exist = false)
    private String deptName;
    
    /**
     * 预约状态常量
     */
    public static final String STATUS_BOOKED = "已预约";
    public static final String STATUS_CANCELLED = "已取消";
    public static final String STATUS_COMPLETED = "已完成";
}
