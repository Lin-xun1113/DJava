package com.pegasus.hospital.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.pegasus.hospital.dto.DoctorDTO;
import com.pegasus.hospital.dto.LoginResponse;
import com.pegasus.hospital.entity.Doctor;

import java.util.List;

/**
 * 医生服务接口
 * 
 * @author Pegasus Hospital Team
 */
public interface DoctorService extends IService<Doctor> {
    
    /**
     * 医生登录
     */
    LoginResponse login(String doctorId, String password);
    
    /**
     * 查询所有医生（包含科室信息）
     */
    List<Doctor> getAllDoctors();
    
    /**
     * 按科室查询医生
     */
    List<Doctor> getByDeptId(Long deptId);
    
    /**
     * 分页查询医生
     */
    IPage<Doctor> getPage(Page<Doctor> page, Long deptId, String name);
    
    /**
     * 根据医生ID查询
     */
    Doctor getByDoctorId(String doctorId);
    
    /**
     * 添加医生
     */
    Doctor addDoctor(DoctorDTO dto);
    
    /**
     * 更新医生信息
     */
    Doctor updateDoctor(String doctorId, DoctorDTO dto);
    
    /**
     * 批量导入医生
     */
    int batchImport(List<DoctorDTO> doctors);
}
