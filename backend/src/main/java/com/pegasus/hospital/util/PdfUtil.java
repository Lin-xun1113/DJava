package com.pegasus.hospital.util;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.pegasus.hospital.mapper.AppointmentMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

/**
 * PDF工具类
 * 
 * 使用iText生成PDF报告
 * 
 * @author Pegasus Hospital Team
 */
@Component
public class PdfUtil {
    
    @Autowired
    private AppointmentMapper appointmentMapper;
    
    private static final DateTimeFormatter MONTH_FORMATTER = DateTimeFormatter.ofPattern("yyyy年MM月");
    
    /**
     * 生成月度统计报告
     * 
     * 包含：
     * 1. 报告标题和时间范围
     * 2. 各科室预约量统计
     * 3. 医生工作量统计
     */
    public void generateMonthlyReport(YearMonth month, HttpServletResponse response) throws IOException {
        LocalDate startDate = month.atDay(1);
        LocalDate endDate = month.atEndOfMonth();
        
        // 设置响应头
        String fileName = "月度统计报告_" + month.format(DateTimeFormatter.ofPattern("yyyy-MM")) + ".pdf";
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=" + 
                URLEncoder.encode(fileName, StandardCharsets.UTF_8));
        
        try (OutputStream out = response.getOutputStream();
             PdfWriter writer = new PdfWriter(out);
             PdfDocument pdf = new PdfDocument(writer);
             Document document = new Document(pdf)) {
            
            // 使用系统字体支持中文
            PdfFont font;
            try {
                // 尝试使用系统中文字体
                font = PdfFontFactory.createFont("STSong-Light", "UniGB-UCS2-H");
            } catch (Exception e) {
                // 如果没有中文字体，使用默认字体
                font = PdfFontFactory.createFont();
            }
            document.setFont(font);
            
            // 标题
            Paragraph title = new Paragraph("飞马星球医院预约挂号系统")
                    .setFontSize(20)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(10);
            document.add(title);
            
            Paragraph subtitle = new Paragraph("月度统计报告")
                    .setFontSize(16)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(5);
            document.add(subtitle);
            
            Paragraph period = new Paragraph("统计周期：" + month.format(MONTH_FORMATTER))
                    .setFontSize(12)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(period);
            
            // 生成时间
            Paragraph generateTime = new Paragraph("生成时间：" + 
                    LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setMarginBottom(20);
            document.add(generateTime);
            
            // 科室预约量统计
            document.add(new Paragraph("一、各科室预约量统计")
                    .setFontSize(14)
                    .setBold()
                    .setMarginTop(10)
                    .setMarginBottom(10));
            
            List<Map<String, Object>> deptStats = appointmentMapper.countByDepartment(startDate, endDate);
            Table deptTable = createStatsTable(new String[]{"科室名称", "预约量"}, deptStats, "dept_name", "count");
            document.add(deptTable);
            
            // 医生工作量统计
            document.add(new Paragraph("二、医生工作量统计")
                    .setFontSize(14)
                    .setBold()
                    .setMarginTop(20)
                    .setMarginBottom(10));
            
            List<Map<String, Object>> doctorStats = appointmentMapper.countByDoctor(startDate, endDate);
            Table doctorTable = createDoctorStatsTable(doctorStats);
            document.add(doctorTable);
            
            // 统计摘要
            document.add(new Paragraph("三、统计摘要")
                    .setFontSize(14)
                    .setBold()
                    .setMarginTop(20)
                    .setMarginBottom(10));
            
            long totalAppointments = deptStats.stream()
                    .mapToLong(m -> ((Number) m.get("count")).longValue())
                    .sum();
            
            document.add(new Paragraph("• 本月总预约量：" + totalAppointments + " 次")
                    .setMarginLeft(20));
            document.add(new Paragraph("• 参与科室数：" + deptStats.size() + " 个")
                    .setMarginLeft(20));
            document.add(new Paragraph("• 出诊医生数：" + doctorStats.size() + " 位")
                    .setMarginLeft(20));
            
            // 页脚
            document.add(new Paragraph("\n\n— 飞马星球医院预约挂号系统 自动生成 —")
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(ColorConstants.GRAY));
        }
    }
    
    /**
     * 创建统计表格
     */
    private Table createStatsTable(String[] headers, List<Map<String, Object>> data, 
                                    String nameKey, String countKey) {
        Table table = new Table(UnitValue.createPercentArray(new float[]{70, 30}))
                .setWidth(UnitValue.createPercentValue(100));
        
        // 表头
        for (String header : headers) {
            table.addHeaderCell(new Cell()
                    .add(new Paragraph(header))
                    .setBackgroundColor(new DeviceRgb(66, 139, 202))
                    .setFontColor(ColorConstants.WHITE)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setPadding(5));
        }
        
        // 数据行
        if (data.isEmpty()) {
            table.addCell(new Cell(1, 2)
                    .add(new Paragraph("暂无数据"))
                    .setTextAlignment(TextAlignment.CENTER)
                    .setPadding(10));
        } else {
            for (Map<String, Object> row : data) {
                table.addCell(new Cell()
                        .add(new Paragraph(String.valueOf(row.get(nameKey))))
                        .setPadding(5));
                table.addCell(new Cell()
                        .add(new Paragraph(String.valueOf(row.get(countKey))))
                        .setTextAlignment(TextAlignment.CENTER)
                        .setPadding(5));
            }
        }
        
        return table;
    }
    
    /**
     * 创建医生统计表格
     */
    private Table createDoctorStatsTable(List<Map<String, Object>> data) {
        Table table = new Table(UnitValue.createPercentArray(new float[]{25, 25, 25, 25}))
                .setWidth(UnitValue.createPercentValue(100));
        
        // 表头
        String[] headers = {"医生ID", "医生姓名", "所属科室", "预约量"};
        for (String header : headers) {
            table.addHeaderCell(new Cell()
                    .add(new Paragraph(header))
                    .setBackgroundColor(new DeviceRgb(66, 139, 202))
                    .setFontColor(ColorConstants.WHITE)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setPadding(5));
        }
        
        // 数据行
        if (data.isEmpty()) {
            table.addCell(new Cell(1, 4)
                    .add(new Paragraph("暂无数据"))
                    .setTextAlignment(TextAlignment.CENTER)
                    .setPadding(10));
        } else {
            for (Map<String, Object> row : data) {
                table.addCell(new Cell()
                        .add(new Paragraph(String.valueOf(row.get("doctor_id"))))
                        .setTextAlignment(TextAlignment.CENTER)
                        .setPadding(5));
                table.addCell(new Cell()
                        .add(new Paragraph(String.valueOf(row.get("doctor_name"))))
                        .setTextAlignment(TextAlignment.CENTER)
                        .setPadding(5));
                table.addCell(new Cell()
                        .add(new Paragraph(row.get("dept_name") != null ? 
                                String.valueOf(row.get("dept_name")) : "-"))
                        .setTextAlignment(TextAlignment.CENTER)
                        .setPadding(5));
                table.addCell(new Cell()
                        .add(new Paragraph(String.valueOf(row.get("count"))))
                        .setTextAlignment(TextAlignment.CENTER)
                        .setPadding(5));
            }
        }
        
        return table;
    }
}
