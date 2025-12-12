package com.pegasus.hospital.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.pegasus.hospital.dto.LoginResponse;
import com.pegasus.hospital.dto.PatientRegisterRequest;
import com.pegasus.hospital.dto.PatientUpdateRequest;
import com.pegasus.hospital.entity.Patient;
import com.pegasus.hospital.exception.BusinessException;
import com.pegasus.hospital.mapper.PatientMapper;
import com.pegasus.hospital.service.PatientService;
import com.pegasus.hospital.util.IdGenerator;
import com.pegasus.hospital.util.JwtUtil;
import com.pegasus.hospital.util.PasswordUtil;
import com.pegasus.hospital.util.ValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * 患者服务实现类
 * 
 * @author Pegasus Hospital Team
 */
@Service
public class PatientServiceImpl extends ServiceImpl<PatientMapper, Patient> implements PatientService {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    @Transactional
    public Patient register(PatientRegisterRequest request) {
        // 1. 验证身份证号格式
        if (!ValidationUtil.isValidIdentityId(request.getIdentityId())) {
            throw new BusinessException("身份证号格式不正确");
        }
        
        // 2. 验证年龄（年满10岁）
        if (!ValidationUtil.isAgeValid(request.getIdentityId())) {
            throw new BusinessException("年龄必须满10岁才能注册");
        }
        
        // 3. 检查身份证号是否已注册
        if (baseMapper.selectByIdentityId(request.getIdentityId()) != null) {
            throw new BusinessException("该身份证号已注册");
        }
        
        // 4. 生成患者ID
        String maxId = baseMapper.selectMaxPatientId();
        String patientId = IdGenerator.generateNextPatientId(maxId);
        
        // 5. 从身份证解析信息
        LocalDate birthDate = ValidationUtil.parseBirthDateFromIdentity(request.getIdentityId());
        String gender = request.getGender();
        if (gender == null || gender.isEmpty()) {
            gender = ValidationUtil.parseGenderFromIdentity(request.getIdentityId());
        }
        
        // 6. 创建患者对象
        Patient patient = Patient.builder()
                .patientId(patientId)
                .name(request.getName())
                .password(PasswordUtil.encrypt(request.getPassword()))
                .identityId(request.getIdentityId().toUpperCase())
                .phone(request.getPhone())
                .gender(gender)
                .birthDate(birthDate)
                .status(1)
                .build();
        
        // 7. 保存到数据库
        save(patient);
        
        // 8. 返回时清除密码
        patient.setPassword(null);
        return patient;
    }
    
    @Override
    public LoginResponse login(String patientId, String password) {
        // 1. 查询患者
        Patient patient = baseMapper.selectByPatientId(patientId);
        if (patient == null) {
            throw new BusinessException("患者ID不存在");
        }
        
        // 2. 检查状态
        if (patient.getStatus() == 0) {
            throw new BusinessException("该账号已注销");
        }
        
        // 3. 验证密码
        if (!PasswordUtil.matches(password, patient.getPassword())) {
            throw new BusinessException("密码错误");
        }
        
        // 4. 生成JWT令牌
        String token = jwtUtil.generateToken(patient.getPatientId(), "patient", patient.getName());
        
        // 5. 返回登录响应
        return LoginResponse.builder()
                .token(token)
                .userId(patient.getPatientId())
                .name(patient.getName())
                .userType("patient")
                .build();
    }
    
    @Override
    @Transactional
    public boolean deactivate(String patientId) {
        Patient patient = baseMapper.selectByPatientId(patientId);
        if (patient == null) {
            throw new BusinessException("患者ID不存在");
        }
        
        // 设置状态为已注销
        patient.setStatus(0);
        return updateById(patient);
    }
    
    @Override
    @Transactional
    public Patient updateInfo(String patientId, PatientUpdateRequest request) {
        // 1. 查询患者
        Patient patient = baseMapper.selectByPatientId(patientId);
        if (patient == null) {
            throw new BusinessException("患者ID不存在");
        }
        
        // 2. 更新允许修改的字段（ID和身份证号不可修改）
        if (request.getName() != null && !request.getName().isEmpty()) {
            patient.setName(request.getName());
        }
        
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            patient.setPassword(PasswordUtil.encrypt(request.getPassword()));
        }
        
        if (request.getPhone() != null) {
            patient.setPhone(request.getPhone());
        }
        
        if (request.getGender() != null) {
            patient.setGender(request.getGender());
        }
        
        // 3. 保存更新
        updateById(patient);
        
        // 4. 返回时清除密码
        patient.setPassword(null);
        return patient;
    }
    
    @Override
    public Patient getByPatientId(String patientId) {
        Patient patient = baseMapper.selectByPatientId(patientId);
        if (patient != null) {
            patient.setPassword(null);
        }
        return patient;
    }
}
