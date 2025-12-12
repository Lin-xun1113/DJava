package com.pegasus.hospital.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.regex.Pattern;

/**
 * 数据验证工具类
 * 
 * 提供各种数据验证方法，确保输入数据的有效性
 * 
 * @author Pegasus Hospital Team
 */
public class ValidationUtil {
    
    // 患者ID正则（10位数字）
    private static final Pattern PATIENT_ID_PATTERN = Pattern.compile("^\\d{10}$");
    
    // 医生ID正则（8位数字）
    private static final Pattern DOCTOR_ID_PATTERN = Pattern.compile("^\\d{8}$");
    
    // 预约号正则（12位数字）
    private static final Pattern APPT_ID_PATTERN = Pattern.compile("^\\d{12}$");
    
    // 身份证号正则（18位，最后一位可以是X）
    private static final Pattern IDENTITY_ID_PATTERN = Pattern.compile("^\\d{17}[\\dXx]$");
    
    // 手机号正则
    private static final Pattern PHONE_PATTERN = Pattern.compile("^1[3-9]\\d{9}$");
    
    // 性别正则
    private static final Pattern GENDER_PATTERN = Pattern.compile("^[MF]$");
    
    /**
     * 验证患者ID格式（10位数字）
     */
    public static boolean isValidPatientId(String patientId) {
        return patientId != null && PATIENT_ID_PATTERN.matcher(patientId).matches();
    }
    
    /**
     * 验证医生ID格式（8位数字）
     */
    public static boolean isValidDoctorId(String doctorId) {
        return doctorId != null && DOCTOR_ID_PATTERN.matcher(doctorId).matches();
    }
    
    /**
     * 验证预约号格式（12位数字）
     */
    public static boolean isValidApptId(String apptId) {
        return apptId != null && APPT_ID_PATTERN.matcher(apptId).matches();
    }
    
    /**
     * 验证身份证号格式（18位）
     */
    public static boolean isValidIdentityId(String identityId) {
        if (identityId == null || !IDENTITY_ID_PATTERN.matcher(identityId).matches()) {
            return false;
        }
        // 验证日期部分是否有效
        try {
            String dateStr = identityId.substring(6, 14);
            LocalDate.parse(dateStr, DateTimeFormatter.BASIC_ISO_DATE);
        } catch (DateTimeParseException e) {
            return false;
        }
        return true;  // 简化校验，只检查格式和日期有效性
    }
    
    /**
     * 验证身份证校验位
     */
    private static boolean validateIdentityChecksum(String identityId) {
        int[] weights = {7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2};
        char[] checkChars = {'1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'};
        
        int sum = 0;
        for (int i = 0; i < 17; i++) {
            sum += (identityId.charAt(i) - '0') * weights[i];
        }
        
        char expectedCheck = checkChars[sum % 11];
        char actualCheck = Character.toUpperCase(identityId.charAt(17));
        
        return expectedCheck == actualCheck;
    }
    
    /**
     * 验证手机号格式
     */
    public static boolean isValidPhone(String phone) {
        return phone == null || phone.isEmpty() || PHONE_PATTERN.matcher(phone).matches();
    }
    
    /**
     * 验证性别格式
     */
    public static boolean isValidGender(String gender) {
        return gender == null || gender.isEmpty() || GENDER_PATTERN.matcher(gender).matches();
    }
    
    /**
     * 从身份证号解析出生日期
     */
    public static LocalDate parseBirthDateFromIdentity(String identityId) {
        if (!isValidIdentityId(identityId)) {
            return null;
        }
        try {
            String birthStr = identityId.substring(6, 14);
            return LocalDate.parse(birthStr, DateTimeFormatter.BASIC_ISO_DATE);
        } catch (DateTimeParseException e) {
            return null;
        }
    }
    
    /**
     * 从身份证号计算年龄
     */
    public static int calculateAgeFromIdentity(String identityId) {
        LocalDate birthDate = parseBirthDateFromIdentity(identityId);
        if (birthDate == null) {
            return -1;
        }
        return LocalDate.now().getYear() - birthDate.getYear();
    }
    
    /**
     * 验证年龄是否满10岁（飞马星球注册要求）
     */
    public static boolean isAgeValid(String identityId) {
        int age = calculateAgeFromIdentity(identityId);
        return age >= 10;
    }
    
    /**
     * 从身份证号解析性别
     * 第17位奇数为男，偶数为女
     */
    public static String parseGenderFromIdentity(String identityId) {
        if (!isValidIdentityId(identityId)) {
            return null;
        }
        int genderCode = identityId.charAt(16) - '0';
        return genderCode % 2 == 1 ? "M" : "F";
    }
    
    /**
     * 验证密码强度（不少于4位）
     */
    public static boolean isValidPassword(String password) {
        return password != null && password.length() >= 4;
    }
    
    /**
     * 验证姓名长度（最多20个字符）
     */
    public static boolean isValidName(String name) {
        return name != null && !name.trim().isEmpty() && name.length() <= 20;
    }
    
    /**
     * 验证专长描述长度（最多200个字符）
     */
    public static boolean isValidSpecialty(String specialty) {
        return specialty == null || specialty.length() <= 200;
    }
    
    /**
     * 验证科室名称长度（最多30个字符）
     */
    public static boolean isValidDeptName(String deptName) {
        return deptName != null && !deptName.trim().isEmpty() && deptName.length() <= 30;
    }
}
