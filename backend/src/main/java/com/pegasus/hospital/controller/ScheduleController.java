package com.pegasus.hospital.controller;

import com.pegasus.hospital.dto.Result;
import com.pegasus.hospital.dto.ScheduleDTO;
import com.pegasus.hospital.entity.Schedule;
import com.pegasus.hospital.service.ScheduleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 排班控制器
 * 
 * 提供排班查询和管理接口
 * 
 * @author Pegasus Hospital Team
 */
@RestController
@RequestMapping("/schedule")
public class ScheduleController {
    
    @Autowired
    private ScheduleService scheduleService;
    
    /**
     * 查询指定日期的可预约排班
     * 
     * GET /api/schedule/available
     */
    @GetMapping("/available")
    public Result<List<Schedule>> getAvailable(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Schedule> schedules = scheduleService.getAvailableByDate(date);
        return Result.success(schedules);
    }
    
    /**
     * 获取排班详情
     * 
     * GET /api/schedule/{id}
     */
    @GetMapping("/{id}")
    public Result<Schedule> getById(@PathVariable Long id) {
        Schedule schedule = scheduleService.getById(id);
        if (schedule == null) {
            return Result.error("排班不存在");
        }
        return Result.success(schedule);
    }
    
    /**
     * 添加排班（管理员）
     * 
     * POST /api/schedule
     */
    @PostMapping
    public Result<Schedule> add(@Valid @RequestBody ScheduleDTO dto) {
        Schedule schedule = scheduleService.addSchedule(dto);
        return Result.success("排班添加成功", schedule);
    }
    
    /**
     * 更新排班（管理员）
     * 
     * PUT /api/schedule/{id}
     */
    @PutMapping("/{id}")
    public Result<Schedule> update(@PathVariable Long id, @Valid @RequestBody ScheduleDTO dto) {
        Schedule schedule = scheduleService.updateSchedule(id, dto);
        return Result.success("排班更新成功", schedule);
    }
    
    /**
     * 删除排班（管理员）
     * 
     * DELETE /api/schedule/{id}
     */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return Result.success("排班删除成功", null);
    }
}
