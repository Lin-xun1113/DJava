package com.pegasus.hospital.util;

import com.pegasus.hospital.dto.DoctorDTO;
import com.pegasus.hospital.dto.ScheduleDTO;
import com.pegasus.hospital.entity.Appointment;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * Excel工具类
 * 
 * 使用Apache POI实现Excel导入导出功能
 * 
 * @author Pegasus Hospital Team
 */
@Component
public class ExcelUtil {
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    
    /**
     * 解析医生Excel文件
     * 
     * 格式：医生ID | 姓名 | 密码 | 科室名称 | 专长描述
     */
    public List<DoctorDTO> parseDoctorExcel(MultipartFile file) throws IOException {
        List<DoctorDTO> doctors = new ArrayList<>();
        
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            
            // 跳过表头，从第二行开始
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                
                DoctorDTO dto = new DoctorDTO();
                dto.setDoctorId(getCellStringValue(row.getCell(0)));
                dto.setName(getCellStringValue(row.getCell(1)));
                dto.setPassword(getCellStringValue(row.getCell(2)));
                dto.setDeptName(getCellStringValue(row.getCell(3)));
                dto.setSpecialty(getCellStringValue(row.getCell(4)));
                
                // 跳过空行
                if (dto.getName() == null || dto.getName().isEmpty()) {
                    continue;
                }
                
                // 默认密码
                if (dto.getPassword() == null || dto.getPassword().isEmpty()) {
                    dto.setPassword("123456");
                }
                
                doctors.add(dto);
            }
        }
        
        return doctors;
    }
    
    /**
     * 解析排班Excel文件
     * 
     * 格式：医生ID | 工作日期 | 开始时间 | 结束时间 | 最大预约数
     */
    public List<ScheduleDTO> parseScheduleExcel(MultipartFile file) throws IOException {
        List<ScheduleDTO> schedules = new ArrayList<>();
        
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                
                ScheduleDTO dto = new ScheduleDTO();
                dto.setDoctorId(getCellStringValue(row.getCell(0)));
                
                String dateStr = getCellStringValue(row.getCell(1));
                if (dateStr != null && !dateStr.isEmpty()) {
                    dto.setWorkDate(LocalDate.parse(dateStr, DATE_FORMATTER));
                }
                
                String startTimeStr = getCellStringValue(row.getCell(2));
                if (startTimeStr != null && !startTimeStr.isEmpty()) {
                    dto.setStartTime(LocalTime.parse(startTimeStr, TIME_FORMATTER));
                }
                
                String endTimeStr = getCellStringValue(row.getCell(3));
                if (endTimeStr != null && !endTimeStr.isEmpty()) {
                    dto.setEndTime(LocalTime.parse(endTimeStr, TIME_FORMATTER));
                }
                
                String maxPatientsStr = getCellStringValue(row.getCell(4));
                if (maxPatientsStr != null && !maxPatientsStr.isEmpty()) {
                    dto.setMaxPatients(Integer.parseInt(maxPatientsStr));
                }
                
                // 跳过无效行
                if (dto.getDoctorId() == null || dto.getWorkDate() == null) {
                    continue;
                }
                
                schedules.add(dto);
            }
        }
        
        return schedules;
    }
    
    /**
     * 导出预约记录到Excel
     */
    public void exportAppointments(List<Appointment> appointments, HttpServletResponse response) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("预约记录");
            
            // 创建表头样式
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            
            // 创建表头
            Row headerRow = sheet.createRow(0);
            String[] headers = {"预约号", "患者ID", "患者姓名", "医生ID", "医生姓名", "科室", "预约时间", "状态", "创建时间"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // 填充数据
            int rowNum = 1;
            for (Appointment appt : appointments) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(appt.getApptId());
                row.createCell(1).setCellValue(appt.getPatientId());
                row.createCell(2).setCellValue(appt.getPatientName() != null ? appt.getPatientName() : "");
                row.createCell(3).setCellValue(appt.getDoctorId());
                row.createCell(4).setCellValue(appt.getDoctorName() != null ? appt.getDoctorName() : "");
                row.createCell(5).setCellValue(appt.getDeptName() != null ? appt.getDeptName() : "");
                row.createCell(6).setCellValue(appt.getApptDatetime() != null ? 
                        appt.getApptDatetime().format(DATETIME_FORMATTER) : "");
                row.createCell(7).setCellValue(appt.getStatus());
                row.createCell(8).setCellValue(appt.getCreatedAt() != null ? 
                        appt.getCreatedAt().format(DATETIME_FORMATTER) : "");
            }
            
            // 自动调整列宽
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            // 设置响应头
            String fileName = "预约记录_" + LocalDate.now().format(DATE_FORMATTER) + ".xlsx";
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=" + 
                    URLEncoder.encode(fileName, StandardCharsets.UTF_8));
            
            // 写入响应
            try (OutputStream out = response.getOutputStream()) {
                workbook.write(out);
            }
        }
    }
    
    /**
     * 生成医生导入模板
     */
    public void generateDoctorTemplate(HttpServletResponse response) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("医生信息");
            
            // 表头
            Row headerRow = sheet.createRow(0);
            String[] headers = {"医生ID(8位,可空)", "姓名(必填)", "密码(可空,默认123456)", "科室名称(必填)", "专长描述"};
            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]);
            }
            
            // 示例数据
            Row exampleRow = sheet.createRow(1);
            exampleRow.createCell(0).setCellValue("10000009");
            exampleRow.createCell(1).setCellValue("示例医生");
            exampleRow.createCell(2).setCellValue("123456");
            exampleRow.createCell(3).setCellValue("内科");
            exampleRow.createCell(4).setCellValue("擅长心血管疾病诊治");
            
            // 自动调整列宽
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            // 设置响应头
            String fileName = "医生导入模板.xlsx";
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=" + 
                    URLEncoder.encode(fileName, StandardCharsets.UTF_8));
            
            try (OutputStream out = response.getOutputStream()) {
                workbook.write(out);
            }
        }
    }
    
    /**
     * 生成排班导入模板
     */
    public void generateScheduleTemplate(HttpServletResponse response) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("排班信息");
            
            // 表头
            Row headerRow = sheet.createRow(0);
            String[] headers = {"医生ID(8位,必填)", "工作日期(yyyy-MM-dd)", "开始时间(HH:mm)", "结束时间(HH:mm)", "最大预约数"};
            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]);
            }
            
            // 示例数据
            Row exampleRow = sheet.createRow(1);
            exampleRow.createCell(0).setCellValue("10000001");
            exampleRow.createCell(1).setCellValue(LocalDate.now().plusDays(1).format(DATE_FORMATTER));
            exampleRow.createCell(2).setCellValue("08:00");
            exampleRow.createCell(3).setCellValue("12:00");
            exampleRow.createCell(4).setCellValue("20");
            
            // 自动调整列宽
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            // 设置响应头
            String fileName = "排班导入模板.xlsx";
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=" + 
                    URLEncoder.encode(fileName, StandardCharsets.UTF_8));
            
            try (OutputStream out = response.getOutputStream()) {
                workbook.write(out);
            }
        }
    }
    
    /**
     * 获取单元格字符串值
     */
    private String getCellStringValue(Cell cell) {
        if (cell == null) {
            return null;
        }
        
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getLocalDateTimeCellValue().toLocalDate().format(DATE_FORMATTER);
                }
                // 处理数字，避免科学计数法
                double value = cell.getNumericCellValue();
                if (value == Math.floor(value)) {
                    return String.valueOf((long) value);
                }
                return String.valueOf(value);
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return null;
        }
    }
}
