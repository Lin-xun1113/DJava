package com.pegasus.hospital.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.pegasus.hospital.dto.AppointmentRequest;
import com.pegasus.hospital.entity.Appointment;
import com.pegasus.hospital.entity.Schedule;
import com.pegasus.hospital.exception.BusinessException;
import com.pegasus.hospital.mapper.AppointmentMapper;
import com.pegasus.hospital.service.AppointmentService;
import com.pegasus.hospital.service.ScheduleService;
import com.pegasus.hospital.util.IdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 预约服务实现类
 * 
 * 预约功能使用乐观锁进行并发控制，避免超卖
 * 
 * @author Pegasus Hospital Team
 */
@Service
public class AppointmentServiceImpl extends ServiceImpl<AppointmentMapper, Appointment> implements AppointmentService {
    
    @Autowired
    private ScheduleService scheduleService;
    
    @Override
    @Transactional
    public Appointment book(AppointmentRequest request) {
        // 1. 检查排班是否存在
        Schedule schedule = scheduleService.getById(request.getScheduleId());
        if (schedule == null) {
            throw new BusinessException("排班不存在");
        }
        
        // 2. 检查排班日期是否已过
        if (schedule.getWorkDate().isBefore(LocalDate.now())) {
            throw new BusinessException("不能预约已过期的排班");
        }
        
        // 3. 检查是否已满
        if (schedule.getBookedCount() >= schedule.getMaxPatients()) {
            throw new BusinessException("该时段号源已满");
        }
        
        // 4. 检查患者是否已在该时段预约
        int existCount = baseMapper.countByPatientAndSchedule(request.getPatientId(), request.getScheduleId());
        if (existCount > 0) {
            throw new BusinessException("您已在该时段预约，请勿重复预约");
        }
        
        // 5. 使用乐观锁增加预约数（并发控制关键点）
        boolean success = scheduleService.incrementBookedCount(request.getScheduleId());
        if (!success) {
            throw new BusinessException("预约失败，请重试");
        }
        
        // 6. 生成预约号
        String datePrefix = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        Integer maxSeq = baseMapper.selectMaxDailySeq(datePrefix);
        String apptId = IdGenerator.generateNextApptId(maxSeq != null ? maxSeq : 0);
        
        // 7. 创建预约记录
        Appointment appointment = Appointment.builder()
                .apptId(apptId)
                .patientId(request.getPatientId())
                .doctorId(request.getDoctorId())
                .scheduleId(request.getScheduleId())
                .apptDatetime(request.getApptDatetime())
                .status(Appointment.STATUS_BOOKED)
                .build();
        
        save(appointment);
        
        return baseMapper.selectByApptId(apptId);
    }
    
    @Override
    @Transactional
    public boolean cancel(String apptId, String reason) {
        // 1. 查询预约
        Appointment appointment = baseMapper.selectByApptId(apptId);
        if (appointment == null) {
            throw new BusinessException("预约不存在");
        }
        
        // 2. 检查状态
        if (!Appointment.STATUS_BOOKED.equals(appointment.getStatus())) {
            throw new BusinessException("只能取消'已预约'状态的预约");
        }
        
        // 3. 检查是否在可取消时间内（预约时间2小时前）
        if (appointment.getApptDatetime().minusHours(2).isBefore(LocalDateTime.now())) {
            throw new BusinessException("预约时间2小时内不可取消");
        }
        
        // 4. 更新状态
        appointment.setStatus(Appointment.STATUS_CANCELLED);
        appointment.setCancelReason(reason);
        updateById(appointment);
        
        // 5. 释放号源
        scheduleService.decrementBookedCount(appointment.getScheduleId());
        
        return true;
    }
    
    @Override
    @Transactional
    public boolean complete(String apptId) {
        Appointment appointment = baseMapper.selectByApptId(apptId);
        if (appointment == null) {
            throw new BusinessException("预约不存在");
        }
        
        if (!Appointment.STATUS_BOOKED.equals(appointment.getStatus())) {
            throw new BusinessException("只能完成'已预约'状态的预约");
        }
        
        appointment.setStatus(Appointment.STATUS_COMPLETED);
        return updateById(appointment);
    }
    
    @Override
    public Appointment getByApptId(String apptId) {
        return baseMapper.selectByApptId(apptId);
    }
    
    @Override
    public List<Appointment> getByPatientId(String patientId) {
        return baseMapper.selectByPatientId(patientId);
    }
    
    @Override
    public IPage<Appointment> getPage(Page<Appointment> page, String status, LocalDate startDate, LocalDate endDate, Long deptId) {
        return baseMapper.selectPageWithDetails(page, status, startDate, endDate, deptId);
    }
    
    @Override
    public List<Appointment> getForExport(LocalDate startDate, LocalDate endDate) {
        return baseMapper.selectForExport(startDate, endDate);
    }
}
