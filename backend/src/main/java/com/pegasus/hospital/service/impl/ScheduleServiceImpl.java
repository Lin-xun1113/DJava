package com.pegasus.hospital.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.pegasus.hospital.dto.ScheduleDTO;
import com.pegasus.hospital.entity.Schedule;
import com.pegasus.hospital.exception.BusinessException;
import com.pegasus.hospital.mapper.ScheduleMapper;
import com.pegasus.hospital.service.ScheduleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * 排班服务实现类
 * 
 * @author Pegasus Hospital Team
 */
@Service
public class ScheduleServiceImpl extends ServiceImpl<ScheduleMapper, Schedule> implements ScheduleService {
    
    @Override
    public List<Schedule> getByDoctorAndDate(String doctorId, LocalDate workDate) {
        return baseMapper.selectByDoctorAndDate(doctorId, workDate);
    }
    
    @Override
    public List<Schedule> getAvailableByDoctor(String doctorId) {
        return baseMapper.selectAvailableByDoctor(doctorId, LocalDate.now());
    }
    
    @Override
    public List<Schedule> getAvailableByDate(LocalDate workDate) {
        return baseMapper.selectAvailableByDate(workDate);
    }
    
    @Override
    @Transactional
    public Schedule addSchedule(ScheduleDTO dto) {
        // 检查是否已存在相同排班
        List<Schedule> existing = baseMapper.selectByDoctorAndDate(dto.getDoctorId(), dto.getWorkDate());
        for (Schedule s : existing) {
            if (s.getStartTime().equals(dto.getStartTime())) {
                throw new BusinessException("该时间段已存在排班");
            }
        }
        
        Schedule schedule = Schedule.builder()
                .doctorId(dto.getDoctorId())
                .workDate(dto.getWorkDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .maxPatients(dto.getMaxPatients() != null ? dto.getMaxPatients() : 20)
                .bookedCount(0)
                .version(0)
                .build();
        
        save(schedule);
        return schedule;
    }
    
    @Override
    @Transactional
    public Schedule updateSchedule(Long id, ScheduleDTO dto) {
        Schedule schedule = getById(id);
        if (schedule == null) {
            throw new BusinessException("排班不存在");
        }
        
        // 如果已有预约，不允许修改时间
        if (schedule.getBookedCount() > 0) {
            if (!schedule.getWorkDate().equals(dto.getWorkDate()) ||
                !schedule.getStartTime().equals(dto.getStartTime()) ||
                !schedule.getEndTime().equals(dto.getEndTime())) {
                throw new BusinessException("已有预约的排班不能修改时间");
            }
        }
        
        if (dto.getWorkDate() != null) {
            schedule.setWorkDate(dto.getWorkDate());
        }
        if (dto.getStartTime() != null) {
            schedule.setStartTime(dto.getStartTime());
        }
        if (dto.getEndTime() != null) {
            schedule.setEndTime(dto.getEndTime());
        }
        if (dto.getMaxPatients() != null) {
            if (dto.getMaxPatients() < schedule.getBookedCount()) {
                throw new BusinessException("最大预约数不能小于已预约数");
            }
            schedule.setMaxPatients(dto.getMaxPatients());
        }
        
        updateById(schedule);
        return schedule;
    }
    
    @Override
    @Transactional
    public boolean deleteSchedule(Long id) {
        Schedule schedule = getById(id);
        if (schedule == null) {
            throw new BusinessException("排班不存在");
        }
        
        if (schedule.getBookedCount() > 0) {
            throw new BusinessException("已有预约的排班不能删除");
        }
        
        return removeById(id);
    }
    
    @Override
    @Transactional
    public int batchImport(List<ScheduleDTO> schedules) {
        int successCount = 0;
        for (ScheduleDTO dto : schedules) {
            try {
                addSchedule(dto);
                successCount++;
            } catch (Exception e) {
                log.warn("导入排班失败: " + dto.getDoctorId() + " " + dto.getWorkDate() + ", 原因: " + e.getMessage());
            }
        }
        return successCount;
    }
    
    @Override
    @Transactional
    public boolean incrementBookedCount(Long scheduleId) {
        Schedule schedule = getById(scheduleId);
        if (schedule == null) {
            throw new BusinessException("排班不存在");
        }
        
        // 使用乐观锁更新，防止超卖
        int rows = baseMapper.incrementBookedCount(scheduleId, schedule.getVersion());
        if (rows == 0) {
            throw new BusinessException("预约失败，号源已满或已被他人抢占，请重试");
        }
        return true;
    }
    
    @Override
    @Transactional
    public boolean decrementBookedCount(Long scheduleId) {
        return baseMapper.decrementBookedCount(scheduleId) > 0;
    }
}
