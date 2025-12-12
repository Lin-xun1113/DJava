package com.pegasus.hospital.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.pegasus.hospital.entity.Appointment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 预约Mapper接口
 * 
 * @author Pegasus Hospital Team
 */
@Mapper
public interface AppointmentMapper extends BaseMapper<Appointment> {
    
    /**
     * 根据预约号查询
     */
    @Select("SELECT a.*, p.name as patient_name, d.name as doctor_name, dept.dept_name " +
            "FROM appointment a " +
            "LEFT JOIN patient p ON a.patient_id = p.patient_id " +
            "LEFT JOIN doctor d ON a.doctor_id = d.doctor_id " +
            "LEFT JOIN department dept ON d.dept_id = dept.id " +
            "WHERE a.appt_id = #{apptId}")
    Appointment selectByApptId(String apptId);
    
    /**
     * 查询患者的预约列表
     */
    @Select("SELECT a.*, p.name as patient_name, d.name as doctor_name, dept.dept_name " +
            "FROM appointment a " +
            "LEFT JOIN patient p ON a.patient_id = p.patient_id " +
            "LEFT JOIN doctor d ON a.doctor_id = d.doctor_id " +
            "LEFT JOIN department dept ON d.dept_id = dept.id " +
            "WHERE a.patient_id = #{patientId} " +
            "ORDER BY a.appt_datetime DESC")
    List<Appointment> selectByPatientId(String patientId);
    
    /**
     * 查询医生的预约列表
     */
    @Select("SELECT a.*, p.name as patient_name, d.name as doctor_name, dept.dept_name " +
            "FROM appointment a " +
            "LEFT JOIN patient p ON a.patient_id = p.patient_id " +
            "LEFT JOIN doctor d ON a.doctor_id = d.doctor_id " +
            "LEFT JOIN department dept ON d.dept_id = dept.id " +
            "WHERE a.doctor_id = #{doctorId} " +
            "AND a.appt_datetime BETWEEN #{startTime} AND #{endTime} " +
            "ORDER BY a.appt_datetime")
    List<Appointment> selectByDoctorAndTime(@Param("doctorId") String doctorId,
                                             @Param("startTime") LocalDateTime startTime,
                                             @Param("endTime") LocalDateTime endTime);
    
    /**
     * 获取当日最大预约号序号
     */
    @Select("SELECT MAX(CAST(SUBSTRING(appt_id, 9) AS UNSIGNED)) FROM appointment " +
            "WHERE appt_id LIKE CONCAT(#{datePrefix}, '%')")
    Integer selectMaxDailySeq(String datePrefix);
    
    /**
     * 检查患者在同一时间段是否已有预约
     */
    @Select("SELECT COUNT(*) FROM appointment " +
            "WHERE patient_id = #{patientId} " +
            "AND schedule_id = #{scheduleId} " +
            "AND status = '已预约'")
    int countByPatientAndSchedule(@Param("patientId") String patientId, @Param("scheduleId") Long scheduleId);
    
    /**
     * 分页查询预约记录（管理员用）
     */
    @Select("<script>" +
            "SELECT a.*, p.name as patient_name, d.name as doctor_name, dept.dept_name " +
            "FROM appointment a " +
            "LEFT JOIN patient p ON a.patient_id = p.patient_id " +
            "LEFT JOIN doctor d ON a.doctor_id = d.doctor_id " +
            "LEFT JOIN department dept ON d.dept_id = dept.id " +
            "WHERE 1=1 " +
            "<if test='status != null and status != \"\"'> AND a.status = #{status} </if>" +
            "<if test='startDate != null'> AND DATE(a.appt_datetime) &gt;= #{startDate} </if>" +
            "<if test='endDate != null'> AND DATE(a.appt_datetime) &lt;= #{endDate} </if>" +
            "<if test='deptId != null'> AND d.dept_id = #{deptId} </if>" +
            "ORDER BY a.appt_datetime DESC" +
            "</script>")
    IPage<Appointment> selectPageWithDetails(Page<Appointment> page, 
                                              @Param("status") String status,
                                              @Param("startDate") LocalDate startDate,
                                              @Param("endDate") LocalDate endDate,
                                              @Param("deptId") Long deptId);
    
    /**
     * 统计各科室预约量
     */
    @Select("SELECT dept.dept_name, COUNT(*) as count " +
            "FROM appointment a " +
            "LEFT JOIN doctor d ON a.doctor_id = d.doctor_id " +
            "LEFT JOIN department dept ON d.dept_id = dept.id " +
            "WHERE DATE(a.appt_datetime) BETWEEN #{startDate} AND #{endDate} " +
            "AND a.status != '已取消' " +
            "GROUP BY dept.id " +
            "ORDER BY count DESC")
    List<Map<String, Object>> countByDepartment(@Param("startDate") LocalDate startDate,
                                                 @Param("endDate") LocalDate endDate);
    
    /**
     * 统计医生工作量
     */
    @Select("SELECT d.doctor_id, d.name as doctor_name, dept.dept_name, COUNT(*) as count " +
            "FROM appointment a " +
            "LEFT JOIN doctor d ON a.doctor_id = d.doctor_id " +
            "LEFT JOIN department dept ON d.dept_id = dept.id " +
            "WHERE DATE(a.appt_datetime) BETWEEN #{startDate} AND #{endDate} " +
            "AND a.status != '已取消' " +
            "GROUP BY d.doctor_id " +
            "ORDER BY count DESC")
    List<Map<String, Object>> countByDoctor(@Param("startDate") LocalDate startDate,
                                            @Param("endDate") LocalDate endDate);
    
    /**
     * 查询导出数据
     */
    @Select("<script>" +
            "SELECT a.*, p.name as patient_name, d.name as doctor_name, dept.dept_name " +
            "FROM appointment a " +
            "LEFT JOIN patient p ON a.patient_id = p.patient_id " +
            "LEFT JOIN doctor d ON a.doctor_id = d.doctor_id " +
            "LEFT JOIN department dept ON d.dept_id = dept.id " +
            "WHERE 1=1 " +
            "<if test='startDate != null'> AND DATE(a.appt_datetime) &gt;= #{startDate} </if>" +
            "<if test='endDate != null'> AND DATE(a.appt_datetime) &lt;= #{endDate} </if>" +
            "ORDER BY a.appt_datetime DESC" +
            "</script>")
    List<Appointment> selectForExport(@Param("startDate") LocalDate startDate,
                                       @Param("endDate") LocalDate endDate);
}
