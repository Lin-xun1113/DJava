package com.pegasus.hospital.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.pegasus.hospital.entity.Department;
import com.pegasus.hospital.exception.BusinessException;
import com.pegasus.hospital.mapper.DepartmentMapper;
import com.pegasus.hospital.service.DepartmentService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 科室服务实现类
 * 
 * @author Pegasus Hospital Team
 */
@Service
public class DepartmentServiceImpl extends ServiceImpl<DepartmentMapper, Department> implements DepartmentService {
    
    @Override
    public List<Department> getAllDepartments() {
        return list();
    }
    
    @Override
    public Department getByDeptName(String deptName) {
        return baseMapper.selectByDeptName(deptName);
    }
    
    @Override
    public boolean addDepartment(String deptName, String description) {
        // 检查科室名是否已存在
        if (getByDeptName(deptName) != null) {
            throw new BusinessException("科室名称已存在");
        }
        
        Department department = Department.builder()
                .deptName(deptName)
                .description(description)
                .build();
        
        return save(department);
    }
}
