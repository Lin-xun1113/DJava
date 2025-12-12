package com.pegasus.hospital.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.pegasus.hospital.entity.Doctor;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 医生Mapper接口
 * 
 * @author Pegasus Hospital Team
 */
@Mapper
public interface DoctorMapper extends BaseMapper<Doctor> {
    
    /**
     * 根据医生ID查询
     */
    @Select("SELECT * FROM doctor WHERE doctor_id = #{doctorId}")
    Doctor selectByDoctorId(String doctorId);
    
    /**
     * 获取最大医生ID
     */
    @Select("SELECT MAX(doctor_id) FROM doctor")
    String selectMaxDoctorId();
    
    /**
     * 查询医生列表（包含科室名称）
     */
    @Select("SELECT d.*, dept.dept_name FROM doctor d " +
            "LEFT JOIN department dept ON d.dept_id = dept.id " +
            "WHERE d.status = 1 " +
            "ORDER BY d.doctor_id")
    List<Doctor> selectAllWithDeptName();
    
    /**
     * 根据科室ID查询医生列表
     */
    @Select("SELECT d.*, dept.dept_name FROM doctor d " +
            "LEFT JOIN department dept ON d.dept_id = dept.id " +
            "WHERE d.dept_id = #{deptId} AND d.status = 1 " +
            "ORDER BY d.doctor_id")
    List<Doctor> selectByDeptId(Long deptId);
    
    /**
     * 分页查询医生（包含科室名称）
     */
    @Select("<script>" +
            "SELECT d.*, dept.dept_name FROM doctor d " +
            "LEFT JOIN department dept ON d.dept_id = dept.id " +
            "WHERE d.status = 1 " +
            "<if test='deptId != null'> AND d.dept_id = #{deptId} </if>" +
            "<if test='name != null and name != \"\"'> AND d.name LIKE CONCAT('%', #{name}, '%') </if>" +
            "ORDER BY d.doctor_id" +
            "</script>")
    IPage<Doctor> selectPageWithDeptName(Page<Doctor> page, @Param("deptId") Long deptId, @Param("name") String name);
}
