package com.pegasus.hospital.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.pegasus.hospital.entity.Department;

import java.util.List;

/**
 * 科室服务接口
 * 
 * @author Pegasus Hospital Team
 */
public interface DepartmentService extends IService<Department> {
    
    /**
     * 获取所有科室列表
     */
    List<Department> getAllDepartments();
    
    /**
     * 根据科室名称查询
     */
    Department getByDeptName(String deptName);
    
    /**
     * 添加科室
     */
    boolean addDepartment(String deptName, String description);
}
