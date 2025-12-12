package com.pegasus.hospital.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.pegasus.hospital.dto.ScheduleDTO;
import com.pegasus.hospital.entity.Schedule;

import java.time.LocalDate;
import java.util.List;

/**
 * 排班服务接口
 * 
 * @author Pegasus Hospital Team
 */
public interface ScheduleService extends IService<Schedule> {
    
    /**
     * 查询医生指定日期的排班
     */
    List<Schedule> getByDoctorAndDate(String doctorId, LocalDate workDate);
    
    /**
     * 查询医生可预约的排班
     */
    List<Schedule> getAvailableByDoctor(String doctorId);
    
    /**
     * 查询指定日期所有可预约排班
     */
    List<Schedule> getAvailableByDate(LocalDate workDate);
    
    /**
     * 添加排班
     */
    Schedule addSchedule(ScheduleDTO dto);
    
    /**
     * 更新排班
     */
    Schedule updateSchedule(Long id, ScheduleDTO dto);
    
    /**
     * 删除排班
     */
    boolean deleteSchedule(Long id);
    
    /**
     * 批量导入排班
     */
    int batchImport(List<ScheduleDTO> schedules);
    
    /**
     * 增加预约数（使用乐观锁）
     */
    boolean incrementBookedCount(Long scheduleId);
    
    /**
     * 减少预约数
     */
    boolean decrementBookedCount(Long scheduleId);
}
