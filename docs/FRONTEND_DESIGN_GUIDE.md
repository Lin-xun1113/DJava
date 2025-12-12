# 飞马星球医院 - 前端设计规范与风格指南

## 1. 设计理念 (Design Philosophy)
- **专业可信 (Trustworthy)**: 使用沉稳的蓝色/青色系，传递医疗行业的严谨与安全感。
- **清晰极简 (Clean & Minimal)**: 界面去除多余装饰，大面积留白，突出核心医疗数据和操作。
- **高效直观 (Efficient)**: 针对不同角色优化布局。患者端注重引导，医生/管理端注重数据呈现与操作效率。

## 2. 色彩系统 (Color System)
基于 Tailwind CSS 默认色板定制。

### 2.1 主色调 (Primary)
用于品牌标识、主要按钮、激活状态。
- **Brand Blue**: `blue-600` (#2563EB) - 经典医疗蓝，传递信任。
- **Hover**: `blue-700` (#1D4ED8)

### 2.2 辅助色 (Secondary)
用于次要操作、背景装饰。
- **Surface**: `slate-50` (#F8FAFC) - 页面整体背景色，比纯白更护眼。
- **Component Background**: `white` (#FFFFFF) - 卡片、弹窗背景。
- **Border**: `slate-200` (#E2E8F0) - 边框颜色。

### 2.3 功能色 (Functional)
- **Success**: `emerald-500` (#10B981) - 预约成功、状态正常。
- **Warning**: `amber-500` (#F59E0B) - 待支付、需注意。
- **Error/Destructive**: `rose-500` (#F43F5E) - 取消预约、删除、错误提示。
- **Info**: `sky-500` (#0EA5E9) - 提示信息。

### 2.4 文字颜色 (Typography Color)
- **Primary Text**: `slate-900` (#0F172A) - 标题、重要正文。
- **Secondary Text**: `slate-500` (#64748B) - 说明文字、次要信息。
- **Muted Text**: `slate-400` (#94A3B8) - 占位符、禁用态文字。

## 3. 排版系统 (Typography)
字体栈：优先使用系统默认无衬线字体 (Inter, system-ui, -apple-system, sans-serif)。

### 3.1 字号层级
- **Display**: `text-3xl` (30px) / Bold - 页面大标题 (如：欢迎页)。
- **H1**: `text-2xl` (24px) / SemiBold - 模块标题 (如：科室列表)。
- **H2**: `text-xl` (20px) / SemiBold - 卡片标题。
- **Body**: `text-sm` (14px) / Regular - 标准正文 (医疗系统信息密度大，推荐使用小一号的字体)。
- **Small**: `text-xs` (12px) / Medium - 辅助标签、元数据。

## 4. 布局规范 (Layout)

### 4.1 间距 (Spacing)
统一使用 Tailwind 间距系统，基数为 4px。
- 组件内边距: `p-4` (16px) 或 `p-6` (24px)。
- 元素间隙: `gap-4` (16px)。
- 页面容器: `max-w-7xl mx-auto px-4`.

### 4.2 圆角 (Radius)
打造亲和力。
- **Button/Input**: `rounded-md` (6px) - 保持专业感，不过分圆润。
- **Card/Modal**: `rounded-lg` (8px) 或 `rounded-xl` (12px) - 现代感。

### 4.3 阴影 (Shadow)
使用轻微阴影增加层次感 (Elevation)。
- **Card**: `shadow-sm` - 默认状态。
- **Hover**: `shadow-md` - 悬停交互。
- **Dropdown/Modal**: `shadow-lg` - 浮层。

## 5. 组件风格 (Component Style)

### 5.1 按钮 (Buttons)
- **Primary**: 蓝色实心背景，白色文字。
- **Outline**: 透明背景，蓝色边框，蓝色文字 (用于次要操作)。
- **Ghost**: 透明背景，灰色文字，Hover 变灰 (用于表格操作)。

### 5.2 卡片 (Cards)
- 白色背景，浅灰色边框 (`border-slate-100`)，微弱阴影。
- 头部包含标题和操作区，主体展示内容。

### 5.3 表格 (Tables) - 医生/管理端核心
- 头部背景浅灰 (`bg-slate-50`)。
- 行高适中，支持斑马纹或 Hover 高亮。
- 操作列固定在右侧。

## 6. UI 库选型建议
推荐使用 **Shadcn/ui**。
- **理由**: 
    1. 源码直接引入，方便修改底层逻辑。
    2. 基于 Radix UI，无障碍访问性 (A11y) 极佳。
    3. 完美结合 Tailwind CSS，开发效率高。
    4. 风格极简，符合上述规范。

## 7. 页面布局模板

### 7.1 患者端 (Portal Layout)
- **Header**: Logo + 导航 (首页/科室/医生) + 个人中心下拉菜单。
- **Content**: 居中容器，最大宽度限制。
- **Footer**: 简单的版权信息。

### 7.2 医生/管理端 (Dashboard Layout)
- **Sidebar**: 左侧固定侧边栏，包含 Logo 和功能菜单。
- **Header**: 顶部显示当前位置面包屑 + 用户信息。
- **Main**: 右侧内容区域，灰色背景，内容卡片化。
