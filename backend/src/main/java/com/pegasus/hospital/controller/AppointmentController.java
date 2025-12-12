package com.pegasus.hospital.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.pegasus.hospital.dto.AppointmentRequest;
import com.pegasus.hospital.dto.Result;
import com.pegasus.hospital.entity.Appointment;
import com.pegasus.hospital.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 预约控制器
 * 
 * 提供预约挂号、取消预约、查询预约等接口
 * 
 * @author Pegasus Hospital Team
 */
@RestController
@RequestMapping("/appointment")
public class AppointmentController {
    
    @Autowired
    private AppointmentService appointmentService;
    
    /**
     * 预约挂号
     * 
     * POST /api/appointment/book
     * 
     * 使用乐观锁进行并发控制，确保号源不超卖
     */
    @PostMapping("/book")
    public Result<Appointment> book(@Valid @RequestBody AppointmentRequest request) {
        Appointment appointment = appointmentService.book(request);
        return Result.success("预约成功，预约号：" + appointment.getApptId(), appointment);
    }
    
    /**
     * 取消预约
     * 
     * PUT /api/appointment/{apptId}/cancel
     * 
     * 规则：预约时间2小时前可取消
     */
    @PutMapping("/{apptId}/cancel")
    public Result<Void> cancel(@PathVariable String apptId,
                               @RequestParam(required = false) String reason) {
        appointmentService.cancel(apptId, reason);
        return Result.success("预约已取消", null);
    }
    
    /**
     * 完成预约（就诊完成）
     * 
     * PUT /api/appointment/{apptId}/complete
     */
    @PutMapping("/{apptId}/complete")
    public Result<Void> complete(@PathVariable String apptId) {
        appointmentService.complete(apptId);
        return Result.success("预约已完成", null);
    }
    
    /**
     * 查询预约详情
     * 
     * GET /api/appointment/{apptId}
     */
    @GetMapping("/{apptId}")
    public Result<Appointment> getByApptId(@PathVariable String apptId) {
        Appointment appointment = appointmentService.getByApptId(apptId);
        if (appointment == null) {
            return Result.error("预约不存在");
        }
        return Result.success(appointment);
    }
    
    /**
     * 查询患者的预约列表
     * 
     * GET /api/appointment/my?patientId=xxx
     */
    @GetMapping("/my")
    public Result<List<Appointment>> getMyAppointments(@RequestParam String patientId) {
        List<Appointment> appointments = appointmentService.getByPatientId(patientId);
        return Result.success(appointments);
    }
    
    /**
     * 分页查询预约记录（管理员）
     * 
     * GET /api/appointment/page
     */
    @GetMapping("/page")
    public Result<IPage<Appointment>> page(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long deptId) {
        Page<Appointment> page = new Page<>(pageNum, pageSize);
        IPage<Appointment> result = appointmentService.getPage(page, status, startDate, endDate, deptId);
        return Result.success(result);
    }
}
