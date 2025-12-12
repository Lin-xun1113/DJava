package com.pegasus.hospital.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.pegasus.hospital.dto.DoctorDTO;
import com.pegasus.hospital.dto.LoginResponse;
import com.pegasus.hospital.entity.Department;
import com.pegasus.hospital.entity.Doctor;
import com.pegasus.hospital.exception.BusinessException;
import com.pegasus.hospital.mapper.DoctorMapper;
import com.pegasus.hospital.service.DepartmentService;
import com.pegasus.hospital.service.DoctorService;
import com.pegasus.hospital.util.IdGenerator;
import com.pegasus.hospital.util.JwtUtil;
import com.pegasus.hospital.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 医生服务实现类
 * 
 * @author Pegasus Hospital Team
 */
@Service
public class DoctorServiceImpl extends ServiceImpl<DoctorMapper, Doctor> implements DoctorService {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private DepartmentService departmentService;
    
    @Override
    public LoginResponse login(String doctorId, String password) {
        // 1. 查询医生
        Doctor doctor = baseMapper.selectByDoctorId(doctorId);
        if (doctor == null) {
            throw new BusinessException("医生ID不存在");
        }
        
        // 2. 检查状态
        if (doctor.getStatus() == 0) {
            throw new BusinessException("该账号已停用");
        }
        
        // 3. 验证密码
        if (!PasswordUtil.matches(password, doctor.getPassword())) {
            throw new BusinessException("密码错误");
        }
        
        // 4. 生成JWT令牌
        String token = jwtUtil.generateToken(doctor.getDoctorId(), "doctor", doctor.getName());
        
        return LoginResponse.builder()
                .token(token)
                .userId(doctor.getDoctorId())
                .name(doctor.getName())
                .userType("doctor")
                .build();
    }
    
    @Override
    public List<Doctor> getAllDoctors() {
        List<Doctor> doctors = baseMapper.selectAllWithDeptName();
        // 清除敏感信息
        doctors.forEach(d -> d.setPassword(null));
        return doctors;
    }
    
    @Override
    public List<Doctor> getByDeptId(Long deptId) {
        List<Doctor> doctors = baseMapper.selectByDeptId(deptId);
        // 清除敏感信息
        doctors.forEach(d -> d.setPassword(null));
        return doctors;
    }
    
    @Override
    public IPage<Doctor> getPage(Page<Doctor> page, Long deptId, String name) {
        IPage<Doctor> result = baseMapper.selectPageWithDeptName(page, deptId, name);
        // 清除敏感信息
        result.getRecords().forEach(d -> d.setPassword(null));
        return result;
    }
    
    @Override
    public Doctor getByDoctorId(String doctorId) {
        Doctor doctor = baseMapper.selectByDoctorId(doctorId);
        if (doctor != null) {
            doctor.setPassword(null);
            // 获取科室名称
            if (doctor.getDeptId() != null) {
                Department dept = departmentService.getById(doctor.getDeptId());
                if (dept != null) {
                    doctor.setDeptName(dept.getDeptName());
                }
            }
        }
        return doctor;
    }
    
    @Override
    @Transactional
    public Doctor addDoctor(DoctorDTO dto) {
        // 1. 处理科室
        Long deptId = dto.getDeptId();
        if (deptId == null && dto.getDeptName() != null) {
            Department dept = departmentService.getByDeptName(dto.getDeptName());
            if (dept != null) {
                deptId = dept.getId();
            }
        }
        
        // 2. 生成医生ID
        String doctorId = dto.getDoctorId();
        if (doctorId == null || doctorId.isEmpty()) {
            String maxId = baseMapper.selectMaxDoctorId();
            doctorId = IdGenerator.generateNextDoctorId(maxId);
        } else {
            // 检查ID是否已存在
            if (baseMapper.selectByDoctorId(doctorId) != null) {
                throw new BusinessException("医生ID已存在：" + doctorId);
            }
        }
        
        // 3. 创建医生对象
        Doctor doctor = Doctor.builder()
                .doctorId(doctorId)
                .name(dto.getName())
                .password(PasswordUtil.encrypt(dto.getPassword() != null ? dto.getPassword() : "123456"))
                .deptId(deptId)
                .specialty(dto.getSpecialty())
                .status(1)
                .build();
        
        save(doctor);
        doctor.setPassword(null);
        return doctor;
    }
    
    @Override
    @Transactional
    public Doctor updateDoctor(String doctorId, DoctorDTO dto) {
        Doctor doctor = baseMapper.selectByDoctorId(doctorId);
        if (doctor == null) {
            throw new BusinessException("医生ID不存在");
        }
        
        if (dto.getName() != null) {
            doctor.setName(dto.getName());
        }
        
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            doctor.setPassword(PasswordUtil.encrypt(dto.getPassword()));
        }
        
        if (dto.getDeptId() != null) {
            doctor.setDeptId(dto.getDeptId());
        } else if (dto.getDeptName() != null) {
            Department dept = departmentService.getByDeptName(dto.getDeptName());
            if (dept != null) {
                doctor.setDeptId(dept.getId());
            }
        }
        
        if (dto.getSpecialty() != null) {
            doctor.setSpecialty(dto.getSpecialty());
        }
        
        updateById(doctor);
        doctor.setPassword(null);
        return doctor;
    }
    
    @Override
    @Transactional
    public int batchImport(List<DoctorDTO> doctors) {
        int successCount = 0;
        for (DoctorDTO dto : doctors) {
            try {
                addDoctor(dto);
                successCount++;
            } catch (Exception e) {
                // 记录失败但继续处理其他记录
                log.warn("导入医生失败: " + dto.getName() + ", 原因: " + e.getMessage());
            }
        }
        return successCount;
    }
}
