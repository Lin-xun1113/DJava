package com.pegasus.hospital.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 患者实体类
 * 
 * 患者ID：10位数字组成
 * 姓名：最多20个字符
 * 密码：不少于4位（存储SHA-256加密后的值）
 * 身份ID：身份证号（18位数字）
 * 手机号：正常手机号
 * 性别：M(男)或F(女)
 * 
 * 业务规则：年满10岁的飞马人可以申请注册
 * 
 * @author Pegasus Hospital Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@TableName("patient")
public class Patient {
    
    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 患者ID（10位数字）- 系统生成，不可修改
     */
    private String patientId;
    
    /**
     * 姓名（最多20个字符）
     */
    private String name;
    
    /**
     * 密码（SHA-256加密存储）
     */
    private String password;
    
    /**
     * 身份证号（18位）- 不可修改
     */
    private String identityId;
    
    /**
     * 手机号（11位）
     */
    private String phone;
    
    /**
     * 性别：M(男)/F(女)
     */
    private String gender;
    
    /**
     * 出生日期（从身份证解析）
     */
    private LocalDate birthDate;
    
    /**
     * 状态：1-正常，0-已注销
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
}
