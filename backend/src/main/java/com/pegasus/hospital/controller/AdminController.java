package com.pegasus.hospital.controller;

import com.pegasus.hospital.dto.DoctorDTO;
import com.pegasus.hospital.dto.Result;
import com.pegasus.hospital.dto.ScheduleDTO;
import com.pegasus.hospital.entity.Appointment;
import com.pegasus.hospital.service.AppointmentService;
import com.pegasus.hospital.service.DoctorService;
import com.pegasus.hospital.service.ScheduleService;
import com.pegasus.hospital.util.ExcelUtil;
import com.pegasus.hospital.util.PdfUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 管理员控制器
 * 
 * 提供Excel导入导出、PDF报告生成等管理功能
 * 
 * @author Pegasus Hospital Team
 */
@RestController
@RequestMapping("/admin")
public class AdminController {
    
    @Autowired
    private DoctorService doctorService;
    
    @Autowired
    private ScheduleService scheduleService;
    
    @Autowired
    private AppointmentService appointmentService;
    
    @Autowired
    private ExcelUtil excelUtil;
    
    @Autowired
    private PdfUtil pdfUtil;
    
    /**
     * 导入医生信息（Excel）
     * 
     * POST /api/admin/doctor/import
     * 
     * Excel格式：医生ID | 姓名 | 密码 | 科室名称 | 专长描述
     */
    @PostMapping("/doctor/import")
    public Result<Map<String, Object>> importDoctors(@RequestParam("file") MultipartFile file) {
        try {
            List<DoctorDTO> doctors = excelUtil.parseDoctorExcel(file);
            int successCount = doctorService.batchImport(doctors);
            
            Map<String, Object> result = new HashMap<>();
            result.put("total", doctors.size());
            result.put("success", successCount);
            result.put("failed", doctors.size() - successCount);
            
            return Result.success("导入完成", result);
        } catch (Exception e) {
            return Result.error("导入失败：" + e.getMessage());
        }
    }
    
    /**
     * 导入排班信息（Excel）
     * 
     * POST /api/admin/schedule/import
     * 
     * Excel格式：医生ID | 工作日期 | 开始时间 | 结束时间 | 最大预约数
     */
    @PostMapping("/schedule/import")
    public Result<Map<String, Object>> importSchedules(@RequestParam("file") MultipartFile file) {
        try {
            List<ScheduleDTO> schedules = excelUtil.parseScheduleExcel(file);
            int successCount = scheduleService.batchImport(schedules);
            
            Map<String, Object> result = new HashMap<>();
            result.put("total", schedules.size());
            result.put("success", successCount);
            result.put("failed", schedules.size() - successCount);
            
            return Result.success("导入完成", result);
        } catch (Exception e) {
            return Result.error("导入失败：" + e.getMessage());
        }
    }
    
    /**
     * 导出预约记录（Excel）
     * 
     * GET /api/admin/appointment/export
     */
    @GetMapping("/appointment/export")
    public void exportAppointments(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            HttpServletResponse response) throws IOException {
        
        // 默认导出最近30天
        if (startDate == null) {
            startDate = LocalDate.now().minusDays(30);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }
        
        List<Appointment> appointments = appointmentService.getForExport(startDate, endDate);
        excelUtil.exportAppointments(appointments, response);
    }
    
    /**
     * 生成月度统计报告（PDF）
     * 
     * GET /api/admin/report/monthly
     * 
     * 包含：各科室预约量、医生工作量等数据
     */
    @GetMapping("/report/monthly")
    public void generateMonthlyReport(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM") YearMonth month,
            HttpServletResponse response) throws IOException {
        
        // 默认当前月
        if (month == null) {
            month = YearMonth.now();
        }
        
        pdfUtil.generateMonthlyReport(month, response);
    }
    
    /**
     * 下载医生导入模板
     * 
     * GET /api/admin/template/doctor
     */
    @GetMapping("/template/doctor")
    public void downloadDoctorTemplate(HttpServletResponse response) throws IOException {
        excelUtil.generateDoctorTemplate(response);
    }
    
    /**
     * 下载排班导入模板
     * 
     * GET /api/admin/template/schedule
     */
    @GetMapping("/template/schedule")
    public void downloadScheduleTemplate(HttpServletResponse response) throws IOException {
        excelUtil.generateScheduleTemplate(response);
    }
}
