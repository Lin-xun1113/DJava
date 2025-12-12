package com.pegasus.hospital.controller;

import com.pegasus.hospital.dto.Result;
import com.pegasus.hospital.entity.Department;
import com.pegasus.hospital.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 科室控制器
 * 
 * 提供科室查询接口
 * 
 * @author Pegasus Hospital Team
 */
@RestController
@RequestMapping("/department")
public class DepartmentController {
    
    @Autowired
    private DepartmentService departmentService;
    
    /**
     * 获取所有科室列表
     * 
     * GET /api/department/list
     */
    @GetMapping("/list")
    public Result<List<Department>> list() {
        List<Department> departments = departmentService.getAllDepartments();
        return Result.success(departments);
    }
    
    /**
     * 获取科室详情
     * 
     * GET /api/department/{id}
     */
    @GetMapping("/{id}")
    public Result<Department> getById(@PathVariable Long id) {
        Department department = departmentService.getById(id);
        if (department == null) {
            return Result.error("科室不存在");
        }
        return Result.success(department);
    }
    
    /**
     * 添加科室（管理员）
     * 
     * POST /api/department
     */
    @PostMapping
    public Result<Void> add(@RequestParam String deptName, 
                            @RequestParam(required = false) String description) {
        departmentService.addDepartment(deptName, description);
        return Result.success("科室添加成功", null);
    }
}
