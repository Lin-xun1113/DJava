package com.pegasus.hospital.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * 统一响应结果类
 * 
 * @param <T> 数据类型
 * @author Pegasus Hospital Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> {
    
    /**
     * 状态码：200-成功，其他-失败
     */
    private Integer code;
    
    /**
     * 响应消息
     */
    private String message;
    
    /**
     * 响应数据
     */
    private T data;
    
    /**
     * 成功响应（无数据）
     */
    public static <T> Result<T> success() {
        return new Result<>(200, "操作成功", null);
    }
    
    /**
     * 成功响应（带数据）
     */
    public static <T> Result<T> success(T data) {
        return new Result<>(200, "操作成功", data);
    }
    
    /**
     * 成功响应（带消息和数据）
     */
    public static <T> Result<T> success(String message, T data) {
        return new Result<>(200, message, data);
    }
    
    /**
     * 失败响应
     */
    public static <T> Result<T> error(String message) {
        return new Result<>(500, message, null);
    }
    
    /**
     * 失败响应（自定义状态码）
     */
    public static <T> Result<T> error(Integer code, String message) {
        return new Result<>(code, message, null);
    }
    
    /**
     * 参数验证失败
     */
    public static <T> Result<T> validateError(String message) {
        return new Result<>(400, message, null);
    }
    
    /**
     * 未授权
     */
    public static <T> Result<T> unauthorized(String message) {
        return new Result<>(401, message, null);
    }
}
