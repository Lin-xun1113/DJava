package com.pegasus.hospital.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.pegasus.hospital.dto.AppointmentRequest;
import com.pegasus.hospital.entity.Appointment;

import java.time.LocalDate;
import java.util.List;

/**
 * 预约服务接口
 * 
 * @author Pegasus Hospital Team
 */
public interface AppointmentService extends IService<Appointment> {
    
    /**
     * 预约挂号
     * 
     * @param request 预约请求
     * @return 预约信息
     */
    Appointment book(AppointmentRequest request);
    
    /**
     * 取消预约
     * 
     * @param apptId 预约号
     * @param reason 取消原因
     * @return 是否成功
     */
    boolean cancel(String apptId, String reason);
    
    /**
     * 完成预约（就诊完成）
     */
    boolean complete(String apptId);
    
    /**
     * 根据预约号查询
     */
    Appointment getByApptId(String apptId);
    
    /**
     * 查询患者的预约列表
     */
    List<Appointment> getByPatientId(String patientId);
    
    /**
     * 分页查询预约记录
     */
    IPage<Appointment> getPage(Page<Appointment> page, String status, LocalDate startDate, LocalDate endDate, Long deptId);
    
    /**
     * 获取导出数据
     */
    List<Appointment> getForExport(LocalDate startDate, LocalDate endDate);
}
