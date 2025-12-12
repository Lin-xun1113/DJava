# 飞马星球医院预约挂号系统 - 快速启动指南

## 📋 环境要求

| 组件 | 版本要求 |
|------|----------|
| JDK | 17+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| MySQL | 8.0+ |

---

## 🚀 快速启动

### 1. 初始化数据库

```bash
# 登录 MySQL
mysql -u root -p

# 执行初始化脚本
source /home/linxun/Coding/DJava/sql/init.sql
```

或直接执行：
```bash
mysql -u root -p < sql/init.sql
```

### 2. 启动后端服务

```bash
cd backend
mvn spring-boot:run
```

后端运行在：`http://localhost:8080/api`

### 3. 启动前端服务

```bash
cd frontend
npm install --legacy-peer-deps  # 首次运行需要安装依赖
npm run dev
```

前端运行在：`http://localhost:5173`

---

## 🔐 测试账号

| 角色 | 账号 | 密码 | 说明 |
|------|------|------|------|
| 管理员 | `admin` | `admin123` | 系统管理功能 |
| 医生 | `10000001` | `123456` | 张华医生（内科） |
| 医生 | `10000002` | `123456` | 李明医生（内科） |
| 患者 | 自行注册 | - | 需要身份证号 |

---

## 📁 项目结构

```
DJava/
├── backend/                 # Spring Boot 后端
│   ├── src/main/java/      # Java 源码
│   ├── src/main/resources/ # 配置文件
│   └── pom.xml             # Maven 配置
├── frontend/               # React 前端
│   ├── src/
│   │   ├── components/     # 通用组件
│   │   ├── pages/          # 页面组件
│   │   ├── services/       # API 服务
│   │   ├── store/          # 状态管理
│   │   └── router/         # 路由配置
│   └── package.json
├── sql/
│   └── init.sql            # 数据库初始化脚本
└── docs/                   # 项目文档
```

---

## 🔧 配置说明

### 后端配置 (`backend/src/main/resources/application.yml`)

```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/pegasus_hospital
    username: root
    password: "123456"  # 修改为你的 MySQL 密码
```

### 前端配置 (`frontend/vite.config.ts`)

```typescript
server: {
  proxy: {
    "/api": {
      target: "http://localhost:8080",  // 后端地址
      changeOrigin: true,
    },
  },
}
```

---

## 🌐 功能入口

### 患者端
- 首页：`http://localhost:5173/`
- 科室导航：`http://localhost:5173/departments`
- 专家介绍：`http://localhost:5173/doctors`
- 我的预约：`http://localhost:5173/patient/appointments`（需登录）

### 管理员端
- 登录后访问：`http://localhost:5173/admin/dashboard`
- 医生管理：`http://localhost:5173/admin/doctors`
- 排班管理：`http://localhost:5173/admin/schedules`
- 预约管理：`http://localhost:5173/admin/appointments`
- 报表中心：`http://localhost:5173/admin/reports`

### 医生端
- 登录后访问：`http://localhost:5173/doctor/dashboard`
- 我的排班：`http://localhost:5173/doctor/schedule`
- 预约管理：`http://localhost:5173/doctor/appointments`

---

## ❓ 常见问题

### Q: 前端启动报错 `peer dependency` 问题
```bash
npm install --legacy-peer-deps
```

### Q: 后端连接数据库失败
1. 确保 MySQL 服务已启动
2. 检查 `application.yml` 中的数据库密码是否正确
3. 确保已执行 `init.sql` 初始化数据库

### Q: 前端页面空白
1. 清除浏览器缓存：`Ctrl + Shift + R`
2. 检查浏览器控制台是否有错误

### Q: 预约失败
1. 确保后端服务已启动
2. 确保已登录患者账号
3. 检查是否选择了排班时段

---

## 📞 技术栈

**后端**
- Spring Boot 3.x
- MyBatis-Plus
- MySQL 8.0
- JWT 认证
- iText (PDF 生成)
- Apache POI (Excel 处理)

**前端**
- React 19
- TypeScript
- Vite
- Tailwind CSS 3
- Shadcn/ui
- Zustand (状态管理)
- React Router 7

---

## 🎯 一键启动脚本

创建 `start.sh`（Linux/Mac）：

```bash
#!/bin/bash

# 启动后端
cd backend
mvn spring-boot:run &
BACKEND_PID=$!

# 等待后端启动
sleep 10

# 启动前端
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "后端 PID: $BACKEND_PID"
echo "前端 PID: $FRONTEND_PID"
echo "按 Ctrl+C 停止所有服务"

wait
```

运行：
```bash
chmod +x start.sh
./start.sh
```
