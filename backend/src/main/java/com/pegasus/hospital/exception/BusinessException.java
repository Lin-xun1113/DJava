package com.pegasus.hospital.exception;

/**
 * 业务异常类
 * 
 * 用于抛出业务逻辑相关的异常
 * 
 * @author Pegasus Hospital Team
 */
public class BusinessException extends RuntimeException {
    
    private Integer code;
    
    public BusinessException(String message) {
        super(message);
        this.code = 500;
    }
    
    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
    }
    
    public Integer getCode() {
        return code;
    }
}
