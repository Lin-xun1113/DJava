package com.pegasus.hospital.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.pegasus.hospital.dto.DoctorDTO;
import com.pegasus.hospital.dto.Result;
import com.pegasus.hospital.entity.Doctor;
import com.pegasus.hospital.entity.Schedule;
import com.pegasus.hospital.service.DoctorService;
import com.pegasus.hospital.service.ScheduleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 医生控制器
 * 
 * 提供医生查询、排班查询等接口
 * 
 * @author Pegasus Hospital Team
 */
@RestController
@RequestMapping("/doctor")
public class DoctorController {
    
    @Autowired
    private DoctorService doctorService;
    
    @Autowired
    private ScheduleService scheduleService;
    
    /**
     * 获取所有医生列表
     * 
     * GET /api/doctor/list
     */
    @GetMapping("/list")
    public Result<List<Doctor>> list(@RequestParam(required = false) Long deptId) {
        List<Doctor> doctors;
        if (deptId != null) {
            doctors = doctorService.getByDeptId(deptId);
        } else {
            doctors = doctorService.getAllDoctors();
        }
        return Result.success(doctors);
    }
    
    /**
     * 分页查询医生
     * 
     * GET /api/doctor/page
     */
    @GetMapping("/page")
    public Result<IPage<Doctor>> page(@RequestParam(defaultValue = "1") Integer pageNum,
                                       @RequestParam(defaultValue = "10") Integer pageSize,
                                       @RequestParam(required = false) Long deptId,
                                       @RequestParam(required = false) String name) {
        Page<Doctor> page = new Page<>(pageNum, pageSize);
        IPage<Doctor> result = doctorService.getPage(page, deptId, name);
        return Result.success(result);
    }
    
    /**
     * 获取医生详情
     * 
     * GET /api/doctor/{doctorId}
     */
    @GetMapping("/{doctorId}")
    public Result<Doctor> getByDoctorId(@PathVariable String doctorId) {
        Doctor doctor = doctorService.getByDoctorId(doctorId);
        if (doctor == null) {
            return Result.error("医生不存在");
        }
        return Result.success(doctor);
    }
    
    /**
     * 获取医生可预约的排班
     * 
     * GET /api/doctor/{doctorId}/schedule
     */
    @GetMapping("/{doctorId}/schedule")
    public Result<List<Schedule>> getSchedule(@PathVariable String doctorId,
                                               @RequestParam(required = false) 
                                               @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Schedule> schedules;
        if (date != null) {
            schedules = scheduleService.getByDoctorAndDate(doctorId, date);
        } else {
            schedules = scheduleService.getAvailableByDoctor(doctorId);
        }
        return Result.success(schedules);
    }
    
    /**
     * 添加医生（管理员）
     * 
     * POST /api/doctor
     */
    @PostMapping
    public Result<Doctor> add(@Valid @RequestBody DoctorDTO dto) {
        Doctor doctor = doctorService.addDoctor(dto);
        return Result.success("医生添加成功", doctor);
    }
    
    /**
     * 更新医生信息（管理员）
     * 
     * PUT /api/doctor/{doctorId}
     */
    @PutMapping("/{doctorId}")
    public Result<Doctor> update(@PathVariable String doctorId, @Valid @RequestBody DoctorDTO dto) {
        Doctor doctor = doctorService.updateDoctor(doctorId, dto);
        return Result.success("医生信息更新成功", doctor);
    }
}
