package com.pegasus.hospital.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

/**
 * 管理员实体类
 * 
 * 用于医院管理功能的管理员账号
 * 
 * @author Pegasus Hospital Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@TableName("admin")
public class Admin {
    
    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 密码（SHA-256加密存储）
     */
    private String password;
    
    /**
     * 姓名
     */
    private String name;
    
    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
