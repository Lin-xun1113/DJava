# 飞马星球医院预约挂号系统 - 项目技术总结

> Pegasus Hospital Appointment System

---

## 1. 项目概述

### 1.1 项目背景
为飞马星球唯一的医院开发一套线上预约挂号系统，解决传统人工挂号效率低、排队时间长等问题，提升医疗服务效率和患者就医体验。

### 1.2 核心功能
- **患者端**：在线注册、预约挂号、查看/取消预约、个人信息管理
- **医生端**：查看排班、管理预约、标记就诊完成
- **管理端**：医生管理、排班管理、预约统计、数据导入导出

---

## 2. 技术选型

### 2.1 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **Java** | 17 | 开发语言 |
| **Spring Boot** | 3.2.0 | 后端框架 |
| **MyBatis-Plus** | 3.5.5 | ORM框架，简化数据库操作 |
| **MySQL** | 8.0+ | 关系型数据库 |
| **HikariCP** | - | 数据库连接池（Spring Boot默认） |
| **JWT** | 0.12.3 | 用户认证与授权 |
| **Apache POI** | 5.2.5 | Excel导入导出 |
| **iText** | 8.0.2 | PDF报告生成 |
| **Lombok** | - | 简化Java代码 |
| **Maven** | 3.9+ | 项目构建与依赖管理 |

### 2.2 前端技术栈（参考）

| 技术 | 版本 | 用途 |
|------|------|------|
| **React** | 18 | 前端框架 |
| **TypeScript** | 5.x | 类型安全 |
| **Vite** | 5.x | 构建工具 |
| **React Router** | 6 | 路由管理 |
| **Axios** | 1.x | HTTP请求 |
| **Zustand** | 4.x | 状态管理 |
| **Tailwind CSS** | 4.x | 样式框架 |

### 2.3 技术选型理由

| 选择 | 理由 |
|------|------|
| Spring Boot 3 | 最新LTS版本，支持Java 17+，内置大量自动配置，开发效率高 |
| MyBatis-Plus | 在MyBatis基础上增强，提供通用CRUD、分页、代码生成等功能 |
| MySQL | 开源免费，性能稳定，社区活跃，适合中小型应用 |
| JWT | 无状态认证，适合前后端分离架构，便于水平扩展 |
| React | 组件化开发，生态丰富，适合构建复杂交互界面 |

---

## 3. 系统架构

### 3.1 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        客户端层                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   患者端    │  │   医生端    │  │   管理端    │         │
│  │  (React)   │  │  (React)   │  │  (React)   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS (RESTful API)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        接口层                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Spring Boot REST Controller            │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │   │
│  │  │  Auth  │ │Patient │ │ Doctor │ │Schedule│ ...   │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘       │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   JWT Filter                        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        业务层                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  Service Layer                      │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌────────────┐  │   │
│  │  │PatientService│ │DoctorService │ │ApptService │  │   │
│  │  └──────────────┘ └──────────────┘ └────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  工具类层                            │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│  │  │ JwtUtil  │ │ExcelUtil │ │ PdfUtil  │            │   │
│  │  └──────────┘ └──────────┘ └──────────┘            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        数据层                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              MyBatis-Plus Mapper                    │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐      │   │
│  │  │PatientMapper│ │DoctorMapper│ │ ApptMapper │      │   │
│  │  └────────────┘ └────────────┘ └────────────┘      │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    MySQL                            │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐     │   │
│  │  │patient │ │ doctor │ │schedule│ │appointment│     │   │
│  │  └────────┘ └────────┘ └────────┘ └──────────┘     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 分层架构说明

| 层级 | 职责 | 主要组件 |
|------|------|----------|
| **Controller层** | 接收请求、参数校验、调用Service、返回响应 | `*Controller.java` |
| **Service层** | 业务逻辑处理、事务管理 | `*Service.java`, `*ServiceImpl.java` |
| **Mapper层** | 数据库操作、SQL映射 | `*Mapper.java` |
| **Entity层** | 数据实体、表映射 | `*Entity.java` |
| **DTO层** | 数据传输对象、请求/响应封装 | `*Request.java`, `*Response.java` |

---

## 4. 数据库设计

### 4.1 ER图

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  department  │       │    doctor    │       │   schedule   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │◄──┐   │ id (PK)      │◄──┐   │ id (PK)      │
│ dept_name    │   │   │ doctor_id    │───┼──►│ doctor_id(FK)│
│ description  │   └───│ dept_id (FK) │   │   │ work_date    │
└──────────────┘       │ name         │   │   │ start_time   │
                       │ password     │   │   │ end_time     │
                       │ specialty    │   │   │ max_patients │
                       └──────────────┘   │   │ booked_count │
                                          │   │ version      │
┌──────────────┐       ┌──────────────────┴───┴──────────────┐
│   patient    │       │           appointment               │
├──────────────┤       ├─────────────────────────────────────┤
│ id (PK)      │       │ id (PK)                             │
│ patient_id   │◄──────│ patient_id (FK)                     │
│ name         │       │ doctor_id (FK)  ────────────────────┘
│ password     │       │ schedule_id (FK)
│ identity_id  │       │ appt_id
│ phone        │       │ appt_datetime
│ gender       │       │ status
│ birth_date   │       │ cancel_reason
└──────────────┘       └─────────────────────────────────────┘

┌──────────────┐
│    admin     │
├──────────────┤
│ id (PK)      │
│ username     │
│ password     │
│ name         │
└──────────────┘
```

### 4.2 核心表设计

| 表名 | 说明 | 记录数预估 |
|------|------|------------|
| `department` | 科室表 | 10-20 |
| `patient` | 患者表 | 10,000+ |
| `doctor` | 医生表 | 50-100 |
| `schedule` | 排班表 | 500+/月 |
| `appointment` | 预约表 | 5,000+/月 |
| `admin` | 管理员表 | 1-5 |

---

## 5. 核心功能实现

### 5.1 用户认证（JWT）

```
登录流程：
┌────────┐    ┌────────────┐    ┌────────────┐    ┌────────┐
│ 客户端  │───►│AuthController│───►│AuthService │───►│Database│
└────────┘    └────────────┘    └────────────┘    └────────┘
     │              │                  │                │
     │  POST /login │                  │                │
     │  {userId,    │                  │                │
     │   password,  │     验证密码      │   查询用户     │
     │   userType}  │─────────────────►│───────────────►│
     │              │                  │◄───────────────│
     │              │◄─────────────────│                │
     │              │   生成JWT Token   │                │
     │◄─────────────│                  │                │
     │  {token,     │                  │                │
     │   userId,    │                  │                │
     │   name}      │                  │                │
```

**Token结构：**
```json
{
  "sub": "1000000001",      // 用户ID
  "userType": "patient",    // 用户类型
  "iat": 1702224000,        // 签发时间
  "exp": 1702310400         // 过期时间（24小时）
}
```

### 5.2 预约挂号（乐观锁）

```java
// 使用乐观锁防止号源超卖
@Transactional
public Appointment book(AppointmentRequest request) {
    // 1. 查询排班
    Schedule schedule = scheduleMapper.selectById(request.getScheduleId());
    
    // 2. 检查号源
    if (schedule.getBookedCount() >= schedule.getMaxPatients()) {
        throw new BusinessException("号源已满");
    }
    
    // 3. 乐观锁更新已预约数
    int updated = scheduleMapper.incrementBookedCount(
        schedule.getId(), 
        schedule.getVersion()  // 版本号
    );
    
    if (updated == 0) {
        throw new BusinessException("预约失败，请重试");  // 并发冲突
    }
    
    // 4. 创建预约记录
    Appointment appointment = new Appointment();
    appointment.setApptId(generateApptId());
    // ... 设置其他字段
    appointmentMapper.insert(appointment);
    
    return appointment;
}
```

**SQL（乐观锁）：**
```sql
UPDATE schedule 
SET booked_count = booked_count + 1, version = version + 1 
WHERE id = ? AND version = ?
```

### 5.3 数据导入导出

**Excel导入流程：**
```
┌─────────┐    ┌───────────┐    ┌──────────┐    ┌────────┐
│ 前端上传 │───►│AdminController│───►│ExcelUtil│───►│Service │
└─────────┘    └───────────┘    └──────────┘    └────────┘
    │               │                │              │
    │ POST          │                │              │
    │ multipart/    │    解析Excel    │              │
    │ form-data     │───────────────►│              │
    │               │                │   List<DTO>  │
    │               │                │─────────────►│
    │               │                │              │ 批量插入
    │               │◄───────────────│◄─────────────│
    │◄──────────────│  返回导入结果   │              │
```

**PDF生成：**
- 使用 iText 8 生成中文PDF报告
- 包含月度预约统计、科室分布、医生工作量等数据

---

## 6. 项目结构

### 6.1 后端目录结构

```
backend/
├── pom.xml                          # Maven配置
├── src/main/java/com/pegasus/hospital/
│   ├── HospitalApplication.java     # 启动类
│   ├── config/
│   │   ├── CorsConfig.java          # 跨域配置
│   │   ├── JwtConfig.java           # JWT配置
│   │   └── MyBatisPlusConfig.java   # MyBatis-Plus配置
│   ├── controller/
│   │   ├── AuthController.java      # 认证接口
│   │   ├── PatientController.java   # 患者接口
│   │   ├── DoctorController.java    # 医生接口
│   │   ├── DepartmentController.java# 科室接口
│   │   ├── ScheduleController.java  # 排班接口
│   │   ├── AppointmentController.java# 预约接口
│   │   └── AdminController.java     # 管理接口
│   ├── service/
│   │   ├── impl/                    # 服务实现
│   │   └── *Service.java            # 服务接口
│   ├── mapper/
│   │   └── *Mapper.java             # 数据访问层
│   ├── entity/
│   │   └── *.java                   # 实体类
│   ├── dto/
│   │   └── *.java                   # 数据传输对象
│   ├── util/
│   │   ├── JwtUtil.java             # JWT工具
│   │   ├── ExcelUtil.java           # Excel工具
│   │   ├── PdfUtil.java             # PDF工具
│   │   └── ValidationUtil.java      # 验证工具
│   └── exception/
│       ├── BusinessException.java   # 业务异常
│       └── GlobalExceptionHandler.java # 全局异常处理
└── src/main/resources/
    ├── application.yml              # 应用配置
    └── mapper/                      # MyBatis XML映射
```

### 6.2 前端目录结构（参考）

```
frontend/
├── package.json
├── vite.config.ts
├── src/
│   ├── main.tsx                     # 入口
│   ├── App.tsx                      # 根组件
│   ├── index.css                    # 全局样式
│   ├── api/
│   │   ├── client.ts                # Axios实例
│   │   └── index.ts                 # API封装
│   ├── store/
│   │   └── auth.ts                  # 认证状态
│   ├── types/
│   │   └── index.ts                 # 类型定义
│   ├── components/
│   │   ├── ui/                      # 通用UI组件
│   │   └── layout/                  # 布局组件
│   ├── pages/
│   │   ├── auth/                    # 认证页面
│   │   ├── patient/                 # 患者页面
│   │   ├── doctor/                  # 医生页面
│   │   └── admin/                   # 管理页面
│   └── router/
│       └── index.tsx                # 路由配置
```

---

## 7. 安全设计

### 7.1 密码安全
- 密码使用 SHA-256 加密存储
- 不存储明文密码

### 7.2 接口安全
- JWT Token 认证
- Token 有效期 24 小时
- 敏感接口需要特定角色权限

### 7.3 数据安全
- 医生列表查询时自动清除密码字段
- 身份证号等敏感信息前端可脱敏显示
- SQL 使用参数化查询，防止注入

### 7.4 并发安全
- 预约使用乐观锁，防止号源超卖
- 数据库事务保证数据一致性

---

## 8. API设计规范

### 8.1 RESTful风格

| 操作 | HTTP方法 | URL示例 |
|------|----------|---------|
| 查询列表 | GET | `/api/doctor/list` |
| 查询详情 | GET | `/api/doctor/{id}` |
| 创建 | POST | `/api/doctor` |
| 更新 | PUT | `/api/doctor/{id}` |
| 删除 | DELETE | `/api/doctor/{id}` |
| 特殊操作 | PUT | `/api/appointment/{id}/cancel` |

### 8.2 统一响应格式

```json
{
  "code": 200,
  "message": "操作成功",
  "data": { ... }
}
```

### 8.3 分页响应格式

```json
{
  "code": 200,
  "data": {
    "records": [...],
    "total": 100,
    "size": 10,
    "current": 1,
    "pages": 10
  }
}
```

---

## 9. 部署说明

### 9.1 环境要求

| 组件 | 版本要求 |
|------|----------|
| JDK | 17+ |
| MySQL | 8.0+ |
| Maven | 3.9+ |
| Node.js | 18+ (前端) |

### 9.2 后端启动

```bash
# 1. 初始化数据库
mysql -u root -p < sql/init.sql

# 2. 修改配置 (application.yml)
# - 数据库连接
# - JWT密钥

# 3. 启动应用
cd backend
mvn spring-boot:run
```

### 9.3 前端启动

```bash
cd frontend
npm install
npm run dev
```

---

## 10. 项目亮点

1. **乐观锁并发控制**：预约挂号使用乐观锁，有效防止号源超卖
2. **JWT无状态认证**：支持三种角色统一认证，便于水平扩展
3. **Excel批量导入**：支持医生和排班信息批量导入，提高效率
4. **PDF报表生成**：自动生成月度统计报告，支持中文
5. **统一异常处理**：全局异常处理器，规范错误响应
6. **参数校验**：使用JSR-303注解进行请求参数校验
7. **MyBatis-Plus**：简化CRUD操作，提供分页插件

---

## 11. 待优化方向

1. **缓存层**：引入Redis缓存热点数据（科室、医生列表）
2. **消息队列**：预约成功后异步发送通知
3. **日志系统**：接入ELK进行日志收集分析
4. **监控告警**：接入Prometheus + Grafana
5. **接口文档**：集成Swagger/OpenAPI自动生成文档
6. **单元测试**：补充Service层单元测试
7. **Docker部署**：容器化部署方案

---

**文档版本:** v1.0  
**项目作者:** Pegasus Hospital Team  
**更新日期:** 2024-12-10
