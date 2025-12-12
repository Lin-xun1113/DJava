package com.pegasus.hospital.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * ID生成器工具类
 * 
 * 用于生成患者ID、预约号等唯一标识
 * 
 * @author Pegasus Hospital Team
 */
public class IdGenerator {
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");
    
    // 患者ID起始值
    private static final AtomicInteger patientIdSequence = new AtomicInteger(1000000000);
    
    // 医生ID起始值
    private static final AtomicInteger doctorIdSequence = new AtomicInteger(10000000);
    
    // 预约号每日序号
    private static final AtomicInteger apptDailySequence = new AtomicInteger(0);
    private static String lastApptDate = "";
    
    /**
     * 生成患者ID（10位数字）
     * 实际使用时应该从数据库获取最大值
     */
    public static String generatePatientId() {
        return String.valueOf(patientIdSequence.incrementAndGet());
    }
    
    /**
     * 生成医生ID（8位数字）
     */
    public static String generateDoctorId() {
        return String.valueOf(doctorIdSequence.incrementAndGet());
    }
    
    /**
     * 生成预约号（12位数字：YYYYMMDD + 4位序号）
     */
    public static synchronized String generateApptId() {
        String today = LocalDate.now().format(DATE_FORMATTER);
        
        // 如果是新的一天，重置序号
        if (!today.equals(lastApptDate)) {
            lastApptDate = today;
            apptDailySequence.set(0);
        }
        
        int seq = apptDailySequence.incrementAndGet();
        return today + String.format("%04d", seq);
    }
    
    /**
     * 从现有最大ID生成下一个患者ID
     * 
     * @param maxId 当前最大的患者ID
     * @return 新的患者ID
     */
    public static String generateNextPatientId(String maxId) {
        if (maxId == null || maxId.isEmpty()) {
            return "1000000001";
        }
        try {
            long current = Long.parseLong(maxId);
            return String.format("%010d", current + 1);
        } catch (NumberFormatException e) {
            return "1000000001";
        }
    }
    
    /**
     * 从现有最大ID生成下一个医生ID
     * 
     * @param maxId 当前最大的医生ID
     * @return 新的医生ID
     */
    public static String generateNextDoctorId(String maxId) {
        if (maxId == null || maxId.isEmpty()) {
            return "10000001";
        }
        try {
            long current = Long.parseLong(maxId);
            return String.format("%08d", current + 1);
        } catch (NumberFormatException e) {
            return "10000001";
        }
    }
    
    /**
     * 生成预约号（基于当日最大序号）
     * 
     * @param maxSeq 当日最大序号
     * @return 新的预约号
     */
    public static String generateNextApptId(int maxSeq) {
        String today = LocalDate.now().format(DATE_FORMATTER);
        return today + String.format("%04d", maxSeq + 1);
    }
}
