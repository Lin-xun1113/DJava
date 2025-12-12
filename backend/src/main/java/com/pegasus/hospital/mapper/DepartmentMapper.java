package com.pegasus.hospital.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.pegasus.hospital.entity.Department;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

/**
 * 科室Mapper接口
 * 
 * 继承BaseMapper，自动获得CRUD方法
 * 体现面向对象的继承特性
 * 
 * @author Pegasus Hospital Team
 */
@Mapper
public interface DepartmentMapper extends BaseMapper<Department> {
    
    /**
     * 根据科室名称查询科室
     */
    @Select("SELECT * FROM department WHERE dept_name = #{deptName}")
    Department selectByDeptName(String deptName);
}
