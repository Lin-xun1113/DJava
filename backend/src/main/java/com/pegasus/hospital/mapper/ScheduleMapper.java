package com.pegasus.hospital.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.pegasus.hospital.entity.Schedule;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.time.LocalDate;
import java.util.List;

/**
 * 排班Mapper接口
 * 
 * @author Pegasus Hospital Team
 */
@Mapper
public interface ScheduleMapper extends BaseMapper<Schedule> {
    
    /**
     * 查询医生在指定日期的排班
     */
    @Select("SELECT s.*, d.name as doctor_name, dept.dept_name " +
            "FROM schedule s " +
            "LEFT JOIN doctor d ON s.doctor_id = d.doctor_id " +
            "LEFT JOIN department dept ON d.dept_id = dept.id " +
            "WHERE s.doctor_id = #{doctorId} AND s.work_date = #{workDate} " +
            "ORDER BY s.start_time")
    List<Schedule> selectByDoctorAndDate(@Param("doctorId") String doctorId, @Param("workDate") LocalDate workDate);
    
    /**
     * 查询医生的可预约排班（未满）
     */
    @Select("SELECT s.*, d.name as doctor_name, dept.dept_name " +
            "FROM schedule s " +
            "LEFT JOIN doctor d ON s.doctor_id = d.doctor_id " +
            "LEFT JOIN department dept ON d.dept_id = dept.id " +
            "WHERE s.doctor_id = #{doctorId} " +
            "AND s.work_date >= #{startDate} " +
            "AND s.booked_count < s.max_patients " +
            "ORDER BY s.work_date, s.start_time")
    List<Schedule> selectAvailableByDoctor(@Param("doctorId") String doctorId, @Param("startDate") LocalDate startDate);
    
    /**
     * 查询指定日期所有可预约排班
     */
    @Select("SELECT s.*, d.name as doctor_name, dept.dept_name " +
            "FROM schedule s " +
            "LEFT JOIN doctor d ON s.doctor_id = d.doctor_id " +
            "LEFT JOIN department dept ON d.dept_id = dept.id " +
            "WHERE s.work_date = #{workDate} " +
            "AND s.booked_count < s.max_patients " +
            "ORDER BY dept.id, s.start_time")
    List<Schedule> selectAvailableByDate(@Param("workDate") LocalDate workDate);
    
    /**
     * 乐观锁更新预约数（+1）
     * 使用version字段进行并发控制
     */
    @Update("UPDATE schedule SET booked_count = booked_count + 1, version = version + 1 " +
            "WHERE id = #{id} AND version = #{version} AND booked_count < max_patients")
    int incrementBookedCount(@Param("id") Long id, @Param("version") Integer version);
    
    /**
     * 减少预约数（取消预约时）
     */
    @Update("UPDATE schedule SET booked_count = booked_count - 1 " +
            "WHERE id = #{id} AND booked_count > 0")
    int decrementBookedCount(@Param("id") Long id);
    
    /**
     * 查询医生某段时间的排班
     */
    @Select("SELECT s.*, d.name as doctor_name, dept.dept_name " +
            "FROM schedule s " +
            "LEFT JOIN doctor d ON s.doctor_id = d.doctor_id " +
            "LEFT JOIN department dept ON d.dept_id = dept.id " +
            "WHERE s.doctor_id = #{doctorId} " +
            "AND s.work_date BETWEEN #{startDate} AND #{endDate} " +
            "ORDER BY s.work_date, s.start_time")
    List<Schedule> selectByDoctorAndDateRange(@Param("doctorId") String doctorId, 
                                               @Param("startDate") LocalDate startDate,
                                               @Param("endDate") LocalDate endDate);
}
