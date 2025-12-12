package com.pegasus.hospital.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.pegasus.hospital.dto.LoginResponse;
import com.pegasus.hospital.dto.PatientRegisterRequest;
import com.pegasus.hospital.dto.PatientUpdateRequest;
import com.pegasus.hospital.entity.Patient;

/**
 * 患者服务接口
 * 
 * @author Pegasus Hospital Team
 */
public interface PatientService extends IService<Patient> {
    
    /**
     * 患者注册
     * 
     * @param request 注册请求
     * @return 注册成功的患者信息
     */
    Patient register(PatientRegisterRequest request);
    
    /**
     * 患者登录
     * 
     * @param patientId 患者ID
     * @param password 密码
     * @return 登录响应（包含token）
     */
    LoginResponse login(String patientId, String password);
    
    /**
     * 患者注销
     * 
     * @param patientId 患者ID
     * @return 是否成功
     */
    boolean deactivate(String patientId);
    
    /**
     * 修改患者信息
     * 
     * @param patientId 患者ID
     * @param request 修改请求
     * @return 修改后的患者信息
     */
    Patient updateInfo(String patientId, PatientUpdateRequest request);
    
    /**
     * 根据患者ID查询
     */
    Patient getByPatientId(String patientId);
}
