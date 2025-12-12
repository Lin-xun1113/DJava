package com.pegasus.hospital.controller;

import com.pegasus.hospital.dto.PatientRegisterRequest;
import com.pegasus.hospital.dto.PatientUpdateRequest;
import com.pegasus.hospital.dto.Result;
import com.pegasus.hospital.entity.Patient;
import com.pegasus.hospital.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 患者控制器
 * 
 * 提供患者注册、注销、信息修改等接口
 * 
 * @author Pegasus Hospital Team
 */
@RestController
@RequestMapping("/patient")
public class PatientController {
    
    @Autowired
    private PatientService patientService;
    
    /**
     * 患者注册
     * 
     * POST /api/patient/register
     * 
     * 业务规则：年满10岁的飞马人可以申请注册
     */
    @PostMapping("/register")
    public Result<Patient> register(@Valid @RequestBody PatientRegisterRequest request) {
        Patient patient = patientService.register(request);
        return Result.success("注册成功，您的患者ID为：" + patient.getPatientId(), patient);
    }
    
    /**
     * 获取患者信息
     * 
     * GET /api/patient/{patientId}
     */
    @GetMapping("/{patientId}")
    public Result<Patient> getInfo(@PathVariable String patientId) {
        Patient patient = patientService.getByPatientId(patientId);
        if (patient == null) {
            return Result.error("患者不存在");
        }
        return Result.success(patient);
    }
    
    /**
     * 修改患者信息
     * 
     * PUT /api/patient/{patientId}
     * 
     * 注意：患者ID和身份证号不可修改
     */
    @PutMapping("/{patientId}")
    public Result<Patient> updateInfo(@PathVariable String patientId, 
                                       @Valid @RequestBody PatientUpdateRequest request) {
        Patient patient = patientService.updateInfo(patientId, request);
        return Result.success("信息修改成功", patient);
    }
    
    /**
     * 患者注销
     * 
     * DELETE /api/patient/{patientId}
     */
    @DeleteMapping("/{patientId}")
    public Result<Void> deactivate(@PathVariable String patientId) {
        patientService.deactivate(patientId);
        return Result.success("账号已注销", null);
    }
}
