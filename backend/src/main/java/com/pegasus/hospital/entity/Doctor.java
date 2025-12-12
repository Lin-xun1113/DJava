package com.pegasus.hospital.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

/**
 * 医生实体类
 * 
 * 医生ID：8位数字组成
 * 姓名：最多20个字符
 * 密码：不少于4位（存储SHA-256加密后的值）
 * 科室：关联科室表
 * 专长描述：最多200个字符
 * 
 * @author Pegasus Hospital Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@TableName("doctor")
public class Doctor {
    
    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 医生ID（8位数字）
     */
    private String doctorId;
    
    /**
     * 姓名（最多20个字符）
     */
    private String name;
    
    /**
     * 密码（SHA-256加密存储）
     */
    private String password;
    
    /**
     * 科室ID
     */
    private Long deptId;
    
    /**
     * 专长描述（最多200个字符）
     */
    private String specialty;
    
    /**
     * 状态：1-在职，0-离职
     */
    private Integer status;
    
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
     * 科室名称（非数据库字段，用于查询展示）
     */
    @TableField(exist = false)
    private String deptName;
}
