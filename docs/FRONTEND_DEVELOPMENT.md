# 飞马星球医院预约挂号系统 - 前端开发文档

> 本文档提供前端开发所需的全部信息，包括项目需求、数据库结构、后端API接口等。

---

## 目录

1. [项目概述](#1-项目概述)
2. [功能需求](#2-功能需求)
3. [角色与权限](#3-角色与权限)
4. [数据库设计](#4-数据库设计)
5. [后端API接口文档](#5-后端api接口文档)
6. [测试账号](#6-测试账号)
7. [业务规则](#7-业务规则)

---

## 1. 项目概述

### 1.1 项目名称
飞马星球医院预约挂号系统 (Pegasus Hospital Appointment System)

### 1.2 技术要求
- 后端API地址: `http://localhost:8080/api`
- 所有请求需携带 `Authorization: Bearer <token>` 头（登录接口除外）
- 请求/响应格式: JSON
- 日期格式: `YYYY-MM-DD`
- 时间格式: `HH:mm:ss`
- 日期时间格式: `YYYY-MM-DDTHH:mm:ss`

### 1.3 统一响应格式
```json
{
  "code": 200,        // 200成功，其他为错误
  "message": "成功",   // 提示信息
  "data": {}          // 返回数据
}
```

---

## 2. 功能需求

### 2.1 患者端功能

| 模块 | 功能点 | 说明 |
|------|--------|------|
| 认证 | 注册 | 填写姓名、身份证、密码、手机号，系统自动生成10位患者ID |
| 认证 | 登录 | 使用患者ID + 密码登录 |
| 首页 | 快捷入口 | 显示科室、医生、我的预约入口 |
| 首页 | 待就诊预约 | 显示最近的待就诊预约 |
| 科室 | 科室列表 | 展示所有科室，点击进入该科室医生列表 |
| 医生 | 医生列表 | 支持按科室筛选、按姓名/专长搜索 |
| 医生 | 医生详情 | 显示医生信息、可预约排班列表 |
| 预约 | 预约挂号 | 选择排班时间段进行预约 |
| 预约 | 我的预约 | 查看所有预约记录，支持按状态筛选 |
| 预约 | 取消预约 | 预约时间2小时前可取消 |
| 个人 | 个人信息 | 查看/修改个人信息（身份证号不可改） |
| 个人 | 账号注销 | 注销账号 |

### 2.2 医生端功能

| 模块 | 功能点 | 说明 |
|------|--------|------|
| 认证 | 登录 | 使用医生ID + 密码登录 |
| 工作台 | 今日统计 | 显示今日预约数、待接诊数、已完成数 |
| 工作台 | 待接诊列表 | 显示今日待接诊患者列表 |
| 排班 | 我的排班 | 查看自己的排班安排 |
| 预约 | 预约管理 | 查看所有预约，可标记就诊完成 |

### 2.3 管理员端功能

| 模块 | 功能点 | 说明 |
|------|--------|------|
| 认证 | 登录 | 使用用户名 + 密码登录 |
| 仪表盘 | 数据统计 | 科室数、医生数、今日预约数、总预约数 |
| 医生管理 | 医生列表 | 分页展示医生，支持搜索 |
| 医生管理 | 添加医生 | 手动添加医生 |
| 医生管理 | 批量导入 | Excel批量导入医生 |
| 排班管理 | 排班列表 | 查看/编辑/删除排班 |
| 排班管理 | 添加排班 | 手动添加排班 |
| 排班管理 | 批量导入 | Excel批量导入排班 |
| 预约管理 | 预约列表 | 分页展示预约记录，支持筛选 |
| 报表中心 | 导出预约 | 导出预约记录Excel |
| 报表中心 | 月度报告 | 生成月度统计报告PDF |

---

## 3. 角色与权限

| 角色 | 标识 | 权限范围 |
|------|------|----------|
| 患者 | `patient` | 预约挂号、查看/取消预约、个人信息管理 |
| 医生 | `doctor` | 查看自己的排班和预约、标记就诊完成 |
| 管理员 | `admin` | 医生管理、排班管理、预约管理、报表导出 |

---

## 4. 数据库设计

### 4.1 科室表 (department)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 科室ID（主键） |
| dept_name | VARCHAR(30) | 科室名称（唯一） |
| description | VARCHAR(200) | 科室描述 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 4.2 患者表 (patient)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| patient_id | VARCHAR(10) | 患者ID（10位数字，唯一） |
| name | VARCHAR(20) | 姓名 |
| password | VARCHAR(64) | 密码（SHA-256加密） |
| identity_id | VARCHAR(18) | 身份证号（18位，唯一） |
| phone | VARCHAR(11) | 手机号 |
| gender | CHAR(1) | 性别：M(男)/F(女) |
| birth_date | DATE | 出生日期 |
| status | TINYINT | 状态：1-正常，0-已注销 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 4.3 医生表 (doctor)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| doctor_id | VARCHAR(8) | 医生ID（8位数字，唯一） |
| name | VARCHAR(20) | 姓名 |
| password | VARCHAR(64) | 密码（SHA-256加密） |
| dept_id | BIGINT | 所属科室ID |
| specialty | VARCHAR(200) | 专长描述 |
| status | TINYINT | 状态：1-在职，0-离职 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

> 注意：查询医生列表时会额外返回 `deptName` 字段（科室名称）

### 4.4 排班表 (schedule)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 排班ID（主键） |
| doctor_id | VARCHAR(8) | 医生ID |
| work_date | DATE | 工作日期 |
| start_time | TIME | 开始时间 |
| end_time | TIME | 结束时间 |
| max_patients | INT | 最大预约数（默认20） |
| booked_count | INT | 已预约数 |
| version | INT | 乐观锁版本号 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

> 注意：查询排班时会额外返回 `doctorName`（医生姓名）、`deptName`（科室名称）字段

### 4.5 预约表 (appointment)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| appt_id | VARCHAR(12) | 预约号（12位：YYYYMMDD + 4位序号） |
| patient_id | VARCHAR(10) | 患者ID |
| doctor_id | VARCHAR(8) | 医生ID |
| schedule_id | BIGINT | 排班ID |
| appt_datetime | DATETIME | 预约时间 |
| status | VARCHAR(10) | 状态：已预约/已取消/已完成 |
| cancel_reason | VARCHAR(200) | 取消原因 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

> 注意：查询预约时会额外返回 `patientName`（患者姓名）、`doctorName`（医生姓名）、`deptName`（科室名称）字段

### 4.6 管理员表 (admin)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| username | VARCHAR(20) | 用户名（唯一） |
| password | VARCHAR(64) | 密码（SHA-256加密） |
| name | VARCHAR(20) | 姓名 |
| created_at | TIMESTAMP | 创建时间 |

---

## 5. 后端API接口文档

### 5.1 认证接口

#### 5.1.1 登录
```
POST /api/auth/login
```

**请求体:**
```json
{
  "userId": "1000000001",    // 患者ID/医生ID/管理员用户名
  "password": "123456",
  "userType": "patient"      // patient | doctor | admin
}
```

**响应:**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "1000000001",
    "name": "张三",
    "userType": "patient"
  }
}
```

---

### 5.2 患者接口

#### 5.2.1 患者注册
```
POST /api/patient/register
```

**请求体:**
```json
{
  "name": "张三",
  "identityId": "110101199001011234",
  "password": "123456",
  "phone": "13800138000"      // 可选
}
```

**响应:**
```json
{
  "code": 200,
  "message": "注册成功，您的患者ID为：1000000001",
  "data": {
    "patientId": "1000000001",
    "name": "张三",
    "identityId": "110101199001011234",
    "phone": "13800138000",
    "gender": "M",
    "birthDate": "1990-01-01",
    "status": 1
  }
}
```

#### 5.2.2 获取患者信息
```
GET /api/patient/{patientId}
```

**响应:**
```json
{
  "code": 200,
  "data": {
    "patientId": "1000000001",
    "name": "张三",
    "identityId": "110101199001011234",
    "phone": "13800138000",
    "gender": "M",
    "birthDate": "1990-01-01",
    "status": 1
  }
}
```

#### 5.2.3 修改患者信息
```
PUT /api/patient/{patientId}
```

**请求体:**
```json
{
  "name": "张三",           // 可选
  "phone": "13900139000",   // 可选
  "password": "654321"      // 可选，修改密码
}
```

#### 5.2.4 注销账号
```
DELETE /api/patient/{patientId}
```

---

### 5.3 科室接口

#### 5.3.1 获取科室列表
```
GET /api/department/list
```

**响应:**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "deptName": "内科",
      "description": "负责诊治各种内科疾病"
    },
    {
      "id": 2,
      "deptName": "外科",
      "description": "负责各类外科手术"
    }
  ]
}
```

#### 5.3.2 获取科室详情
```
GET /api/department/{id}
```

#### 5.3.3 添加科室（管理员）
```
POST /api/department?deptName=xxx&description=xxx
```

---

### 5.4 医生接口

#### 5.4.1 获取医生列表
```
GET /api/doctor/list?deptId={deptId}
```

**参数:**
- `deptId` (可选): 按科室筛选

**响应:**
```json
{
  "code": 200,
  "data": [
    {
      "doctorId": "10000001",
      "name": "张华",
      "deptId": 1,
      "deptName": "内科",
      "specialty": "心血管疾病、高血压、冠心病诊治",
      "status": 1
    }
  ]
}
```

#### 5.4.2 分页查询医生
```
GET /api/doctor/page?pageNum=1&pageSize=10&deptId={deptId}&name={name}
```

**参数:**
- `pageNum`: 页码（默认1）
- `pageSize`: 每页数量（默认10）
- `deptId` (可选): 按科室筛选
- `name` (可选): 按姓名搜索

**响应:**
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

#### 5.4.3 获取医生详情
```
GET /api/doctor/{doctorId}
```

#### 5.4.4 获取医生排班
```
GET /api/doctor/{doctorId}/schedule?date={date}
```

**参数:**
- `date` (可选): 指定日期（YYYY-MM-DD），不传则返回所有可预约排班

**响应:**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "doctorId": "10000001",
      "doctorName": "张华",
      "deptName": "内科",
      "workDate": "2024-12-10",
      "startTime": "08:00:00",
      "endTime": "12:00:00",
      "maxPatients": 20,
      "bookedCount": 5
    }
  ]
}
```

#### 5.4.5 添加医生（管理员）
```
POST /api/doctor
```

**请求体:**
```json
{
  "doctorId": "10000009",
  "name": "新医生",
  "password": "123456",
  "deptId": 1,
  "specialty": "专长描述"
}
```

#### 5.4.6 更新医生（管理员）
```
PUT /api/doctor/{doctorId}
```

---

### 5.5 排班接口

#### 5.5.1 查询指定日期可预约排班
```
GET /api/schedule/available?date={date}
```

**参数:**
- `date` (必填): 日期（YYYY-MM-DD）

#### 5.5.2 获取排班详情
```
GET /api/schedule/{id}
```

#### 5.5.3 添加排班（管理员）
```
POST /api/schedule
```

**请求体:**
```json
{
  "doctorId": "10000001",
  "workDate": "2024-12-15",
  "startTime": "08:00:00",
  "endTime": "12:00:00",
  "maxPatients": 20
}
```

#### 5.5.4 更新排班（管理员）
```
PUT /api/schedule/{id}
```

#### 5.5.5 删除排班（管理员）
```
DELETE /api/schedule/{id}
```

---

### 5.6 预约接口

#### 5.6.1 预约挂号
```
POST /api/appointment/book
```

**请求体:**
```json
{
  "patientId": "1000000001",
  "scheduleId": 1
}
```

**响应:**
```json
{
  "code": 200,
  "message": "预约成功，预约号：202412100001",
  "data": {
    "apptId": "202412100001",
    "patientId": "1000000001",
    "doctorId": "10000001",
    "scheduleId": 1,
    "apptDatetime": "2024-12-10T08:00:00",
    "status": "已预约"
  }
}
```

#### 5.6.2 取消预约
```
PUT /api/appointment/{apptId}/cancel?reason={reason}
```

**参数:**
- `reason` (可选): 取消原因

#### 5.6.3 完成预约（医生/管理员）
```
PUT /api/appointment/{apptId}/complete
```

#### 5.6.4 获取预约详情
```
GET /api/appointment/{apptId}
```

#### 5.6.5 获取患者预约列表
```
GET /api/appointment/my?patientId={patientId}
```

**响应:**
```json
{
  "code": 200,
  "data": [
    {
      "apptId": "202412100001",
      "patientId": "1000000001",
      "patientName": "张三",
      "doctorId": "10000001",
      "doctorName": "张华",
      "deptName": "内科",
      "scheduleId": 1,
      "apptDatetime": "2024-12-10T08:00:00",
      "status": "已预约",
      "cancelReason": null
    }
  ]
}
```

#### 5.6.6 分页查询预约（管理员）
```
GET /api/appointment/page?pageNum=1&pageSize=10&status={status}&startDate={startDate}&endDate={endDate}&deptId={deptId}
```

**参数:**
- `pageNum`: 页码（默认1）
- `pageSize`: 每页数量（默认10）
- `status` (可选): 状态筛选（已预约/已完成/已取消）
- `startDate` (可选): 开始日期
- `endDate` (可选): 结束日期
- `deptId` (可选): 科室筛选

---

### 5.7 管理员接口

#### 5.7.1 导入医生（Excel）
```
POST /api/admin/doctor/import
Content-Type: multipart/form-data
```

**参数:**
- `file`: Excel文件

**Excel格式:** 医生ID | 姓名 | 密码 | 科室名称 | 专长描述

**响应:**
```json
{
  "code": 200,
  "data": {
    "total": 10,
    "success": 8,
    "failed": 2
  }
}
```

#### 5.7.2 导入排班（Excel）
```
POST /api/admin/schedule/import
Content-Type: multipart/form-data
```

**参数:**
- `file`: Excel文件

**Excel格式:** 医生ID | 工作日期 | 开始时间 | 结束时间 | 最大预约数

#### 5.7.3 导出预约记录（Excel）
```
GET /api/admin/appointment/export?startDate={startDate}&endDate={endDate}
```

**参数:**
- `startDate` (可选): 开始日期，默认30天前
- `endDate` (可选): 结束日期，默认今天

**响应:** Excel文件下载

#### 5.7.4 生成月度报告（PDF）
```
GET /api/admin/report/monthly?month={month}
```

**参数:**
- `month` (可选): 月份（YYYY-MM），默认当前月

**响应:** PDF文件下载

#### 5.7.5 下载医生导入模板
```
GET /api/admin/template/doctor
```

**响应:** Excel模板文件下载

#### 5.7.6 下载排班导入模板
```
GET /api/admin/template/schedule
```

**响应:** Excel模板文件下载

---

## 6. 测试账号

| 角色 | 账号 | 密码 |
|------|------|------|
| 管理员 | admin | admin123 |
| 医生 | 10000001 | 123456 |
| 医生 | 10000002 | 123456 |
| 医生 | 10000003 | 123456 |
| 患者 | 需注册 | 自定义 |

> 患者账号需通过注册接口创建，系统自动分配10位数字ID

---

## 7. 业务规则

### 7.1 患者注册规则
- 身份证号必须为18位有效格式
- 根据身份证自动提取性别和出生日期
- 年龄需满10岁
- 同一身份证只能注册一个账号
- 系统自动生成10位数字患者ID

### 7.2 预约规则
- 只能预约有剩余号源的排班（`bookedCount < maxPatients`）
- 同一患者同一排班只能预约一次
- 使用乐观锁防止号源超卖

### 7.3 取消预约规则
- 预约时间2小时前可取消
- 取消后自动释放号源（`bookedCount - 1`）

### 7.4 预约状态流转
```
已预约 → 已完成（就诊完成）
已预约 → 已取消（患者取消/超时未就诊）
```

### 7.5 ID生成规则
- **患者ID**: 10位数字，从1000000001开始递增
- **医生ID**: 8位数字，由管理员指定
- **预约号**: 12位，格式 `YYYYMMDD` + 4位当日序号

---

## 附录：页面路由建议

```
/login                    # 登录页
/register                 # 患者注册页

# 患者端
/patient/home             # 患者首页
/patient/departments      # 科室列表
/patient/doctors          # 医生列表
/patient/doctor/:id       # 医生详情（含预约）
/patient/appointments     # 我的预约
/patient/profile          # 个人中心

# 医生端
/doctor/home              # 医生工作台
/doctor/schedule          # 我的排班
/doctor/appointments      # 预约管理

# 管理员端
/admin/dashboard          # 仪表盘
/admin/doctors            # 医生管理
/admin/schedules          # 排班管理
/admin/appointments       # 预约管理
/admin/reports            # 报表中心
```

---

**文档版本:** v1.0  
**更新日期:** 2024-12-10
