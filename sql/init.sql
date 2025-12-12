-- =====================================================
-- 飞马星球医院预约挂号系统 - 数据库初始化脚本
-- Pegasus Hospital Appointment System
-- =====================================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS pegasus_hospital DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE pegasus_hospital;

-- =====================================================
-- 1. 科室表 (Department)
-- =====================================================
DROP TABLE IF EXISTS department;
CREATE TABLE department (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '科室ID',
    dept_name VARCHAR(30) NOT NULL UNIQUE COMMENT '科室名称',
    description VARCHAR(200) COMMENT '科室描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='科室表';

-- =====================================================
-- 2. 患者表 (Patient)
-- =====================================================
DROP TABLE IF EXISTS patient;
CREATE TABLE patient (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    patient_id VARCHAR(10) NOT NULL UNIQUE COMMENT '患者ID（10位数字）',
    name VARCHAR(20) NOT NULL COMMENT '姓名',
    password VARCHAR(64) NOT NULL COMMENT '密码（SHA-256加密）',
    identity_id VARCHAR(18) NOT NULL UNIQUE COMMENT '身份证号（18位）',
    phone VARCHAR(11) COMMENT '手机号',
    gender CHAR(1) COMMENT '性别：M(男)/F(女)',
    birth_date DATE COMMENT '出生日期',
    status TINYINT DEFAULT 1 COMMENT '状态：1-正常，0-已注销',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_patient_id (patient_id),
    INDEX idx_identity_id (identity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='患者表';

-- =====================================================
-- 3. 医生表 (Doctor)
-- =====================================================
DROP TABLE IF EXISTS doctor;
CREATE TABLE doctor (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    doctor_id VARCHAR(8) NOT NULL UNIQUE COMMENT '医生ID（8位数字）',
    name VARCHAR(20) NOT NULL COMMENT '姓名',
    password VARCHAR(64) NOT NULL COMMENT '密码（SHA-256加密）',
    dept_id BIGINT COMMENT '科室ID',
    specialty VARCHAR(200) COMMENT '专长描述',
    status TINYINT DEFAULT 1 COMMENT '状态：1-在职，0-离职',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_dept_id (dept_id),
    FOREIGN KEY (dept_id) REFERENCES department(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='医生表';

-- =====================================================
-- 4. 排班表 (Schedule)
-- =====================================================
DROP TABLE IF EXISTS schedule;
CREATE TABLE schedule (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '排班ID',
    doctor_id VARCHAR(8) NOT NULL COMMENT '医生ID',
    work_date DATE NOT NULL COMMENT '工作日期',
    start_time TIME NOT NULL COMMENT '开始时间',
    end_time TIME NOT NULL COMMENT '结束时间',
    max_patients INT DEFAULT 20 COMMENT '最大预约数',
    booked_count INT DEFAULT 0 COMMENT '已预约数',
    version INT DEFAULT 0 COMMENT '乐观锁版本号',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_doctor_schedule (doctor_id, work_date, start_time),
    INDEX idx_work_date (work_date),
    FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='排班表';

-- =====================================================
-- 5. 预约表 (Appointment)
-- =====================================================
DROP TABLE IF EXISTS appointment;
CREATE TABLE appointment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    appt_id VARCHAR(12) NOT NULL UNIQUE COMMENT '预约号（12位数字）',
    patient_id VARCHAR(10) NOT NULL COMMENT '患者ID',
    doctor_id VARCHAR(8) NOT NULL COMMENT '医生ID',
    schedule_id BIGINT NOT NULL COMMENT '排班ID',
    appt_datetime DATETIME NOT NULL COMMENT '预约时间（精确到分钟）',
    status VARCHAR(10) DEFAULT '已预约' COMMENT '状态：已预约/已取消/已完成',
    cancel_reason VARCHAR(200) COMMENT '取消原因',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_appt_id (appt_id),
    INDEX idx_patient_id (patient_id),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_schedule_id (schedule_id),
    INDEX idx_appt_datetime (appt_datetime),
    INDEX idx_status (status),
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES schedule(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='预约表';

-- =====================================================
-- 6. 管理员表 (Admin) - 用于医院管理功能
-- =====================================================
DROP TABLE IF EXISTS admin;
CREATE TABLE admin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    username VARCHAR(20) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(64) NOT NULL COMMENT '密码（SHA-256加密）',
    name VARCHAR(20) COMMENT '姓名',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';

-- =====================================================
-- 初始化数据
-- =====================================================

-- 插入默认管理员（密码：admin123，SHA-256加密）
INSERT INTO admin (username, password, name) VALUES 
('admin', '240be518fabd2724ddb6f04eeb9d5b9e16d1d6cc8b1e5c4c8e1e4a1e9e2b8c4a', '系统管理员');

-- 插入科室数据
INSERT INTO department (dept_name, description) VALUES 
('内科', '负责诊治各种内科疾病，包括心血管、消化、呼吸等系统疾病'),
('外科', '负责各类外科手术及创伤处理'),
('儿科', '专门诊治儿童疾病'),
('妇产科', '负责妇科疾病诊治和产科服务'),
('骨科', '专门诊治骨骼、关节及肌肉系统疾病'),
('眼科', '专门诊治眼部疾病'),
('耳鼻喉科', '专门诊治耳、鼻、咽喉疾病'),
('皮肤科', '专门诊治各类皮肤疾病'),
('神经内科', '专门诊治神经系统疾病'),
('口腔科', '专门诊治口腔及牙齿疾病');

-- 插入示例医生数据（密码：123456，SHA-256加密后）
INSERT INTO doctor (doctor_id, name, password, dept_id, specialty) VALUES 
('10000001', '张华', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, '心血管疾病、高血压、冠心病诊治'),
('10000002', '李明', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, '呼吸系统疾病、肺炎、支气管炎'),
('10000003', '王芳', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 2, '普外科手术、腹腔镜微创手术'),
('10000004', '赵丽', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 3, '小儿呼吸道感染、儿童保健'),
('10000005', '刘洋', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 4, '妇科炎症、产前检查、分娩'),
('10000006', '陈伟', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 5, '骨折、关节置换、脊柱疾病'),
('10000007', '杨静', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 6, '白内障、青光眼、近视矫正'),
('10000008', '周强', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 7, '慢性鼻炎、中耳炎、咽喉炎');

-- 插入示例排班数据（未来7天的排班）
INSERT INTO schedule (doctor_id, work_date, start_time, end_time, max_patients) VALUES 
-- 张华医生排班
('10000001', CURDATE(), '08:00:00', '12:00:00', 20),
('10000001', CURDATE(), '14:00:00', '17:00:00', 15),
('10000001', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '08:00:00', '12:00:00', 20),
('10000001', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '14:00:00', '17:00:00', 15),
-- 李明医生排班
('10000002', CURDATE(), '08:00:00', '12:00:00', 20),
('10000002', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', '17:00:00', 15),
-- 王芳医生排班
('10000003', CURDATE(), '08:00:00', '12:00:00', 15),
('10000003', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '08:00:00', '12:00:00', 15),
-- 赵丽医生排班
('10000004', CURDATE(), '08:00:00', '12:00:00', 25),
('10000004', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', '17:00:00', 20),
-- 刘洋医生排班
('10000005', CURDATE(), '08:00:00', '12:00:00', 15),
('10000005', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '08:00:00', '12:00:00', 15);

-- =====================================================
-- 创建存储过程：生成唯一患者ID
-- =====================================================
DROP PROCEDURE IF EXISTS generate_patient_id;
DELIMITER //
CREATE PROCEDURE generate_patient_id(OUT new_id VARCHAR(10))
BEGIN
    DECLARE max_id BIGINT;
    SELECT IFNULL(MAX(CAST(patient_id AS UNSIGNED)), 1000000000) INTO max_id FROM patient;
    SET new_id = LPAD(max_id + 1, 10, '0');
END //
DELIMITER ;

-- =====================================================
-- 创建存储过程：生成唯一预约号
-- =====================================================
DROP PROCEDURE IF EXISTS generate_appt_id;
DELIMITER //
CREATE PROCEDURE generate_appt_id(OUT new_id VARCHAR(12))
BEGIN
    DECLARE prefix VARCHAR(8);
    DECLARE seq INT;
    SET prefix = DATE_FORMAT(NOW(), '%Y%m%d');
    SELECT IFNULL(MAX(CAST(SUBSTRING(appt_id, 9) AS UNSIGNED)), 0) + 1 INTO seq 
    FROM appointment WHERE appt_id LIKE CONCAT(prefix, '%');
    SET new_id = CONCAT(prefix, LPAD(seq, 4, '0'));
END //
DELIMITER ;
