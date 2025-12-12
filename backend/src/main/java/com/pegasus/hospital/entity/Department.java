package com.pegasus.hospital.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

/**
 * 科室实体类
 * 
 * @author Pegasus Hospital Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@TableName("department")
public class Department {
    
    /**
     * 科室ID（主键）
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 科室名称（最多30个字符）
     */
    private String deptName;
    
    /**
     * 科室描述
     */
    private String description;
    
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
