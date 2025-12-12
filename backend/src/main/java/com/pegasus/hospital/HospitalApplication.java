package com.pegasus.hospital;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * 飞马星球医院预约挂号系统 - 启动类
 * 
 * 技术栈：
 * - Spring Boot 3.2 (内嵌Tomcat，多线程处理HTTP请求)
 * - MyBatis-Plus (ORM框架，面向对象数据访问)
 * - HikariCP (高性能数据库连接池)
 * - JWT (用户认证)
 * - Apache POI (Excel导入导出)
 * - iText (PDF报告生成)
 * 
 * @author Pegasus Hospital Team
 * @version 1.0.0
 */
@SpringBootApplication
@MapperScan("com.pegasus.hospital.mapper")
@EnableTransactionManagement  // 启用事务管理
@EnableAsync                  // 启用异步处理（多线程）
public class HospitalApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(HospitalApplication.class, args);
        System.out.println("========================================");
        System.out.println("  飞马星球医院预约挂号系统启动成功！");
        System.out.println("  Pegasus Hospital System Started!");
        System.out.println("  访问地址: http://localhost:8080/api");
        System.out.println("========================================");
    }
}
