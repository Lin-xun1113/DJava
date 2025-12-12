package com.pegasus.hospital.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * 排班实体类
 * 
 * 用于管理医生的工作排班信息
 * 包含乐观锁version字段，用于并发控制
 * 
 * @author Pegasus Hospital Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@TableName("schedule")
public class Schedule {
    
    /**
     * 排班ID（主键）
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 医生ID
     */
    private String doctorId;
    
    /**
     * 工作日期
     */
    private LocalDate workDate;
    
    /**
     * 开始时间
     */
    private LocalTime startTime;
    
    /**
     * 结束时间
     */
    private LocalTime endTime;
    
    /**
     * 最大预约数
     */
    private Integer maxPatients;
    
    /**
     * 已预约数
     */
    private Integer bookedCount;
    
    /**
     * 乐观锁版本号（用于并发控制）
     */
    @Version
    private Integer version;
    
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
     * 剩余可预约数
     */
    public Integer getAvailableCount() {
        return maxPatients - bookedCount;
    }
}
