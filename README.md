
# 🌿 The Wild Oasis — 管理仪表盘（前端）

一个基于 React + Vite 的管理后台前端，使用 Supabase 提供后端服务（数据库、鉴权、文件存储）。

[![React](https://img.shields.io/badge/React-18.x-61DAFB)](https://react.dev/) [![Vite](https://img.shields.io/badge/Vite-4.x-646cff)](https://vitejs.dev/) [![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E)](https://supabase.com/) [![License](https://img.shields.io/badge/License-MIT-blue)](https://opensource.org/licenses/MIT)


## 🚀 项目概述

这是一个以员工管理为核心的仪表盘前端应用，包含预订管理、入住/退房流程、可视化报表与主题切换等功能。后端由 Supabase 托管（Postgres + Auth + Storage），前端通过 `@supabase/supabase-js` 与之交互。

## 核心功能

- 员工管理：新增/编辑员工资料、分配权限与岗位
- 预订与房态管理：查看/编辑预订记录，管理房间状态
- 快速入住/退房：一键办理并生成账单记录
- 实时仪表盘：入住率、营收与近期活动可视化
- 深色/浅色主题切换与响应式布局

## 🛠 技术栈

### 前端

| 技术 | 用途 |
| ---- | ---- |
| React 18 | 组件化开发与视图层 |
| Vite | 快速构建与开发服务器 |
| @tanstack/react-query | 数据请求缓存与同步 |
| @supabase/supabase-js | 与 Supabase 后端交互（Auth/DB/Storage） |
| styled-components | 主题化与组件样式 |
| react-hook-form | 表单管理与验证 |
| react-router-dom | 路由管理 |
| recharts | 数据可视化 |

### 后端（托管服务）

| 服务 | 用途 |
| ---- | ---- |
| Supabase (Postgres) | 存储业务数据、行级安全、SQL 查询 |
| Supabase Auth | 用户/员工鉴权与会话管理 |
| Supabase Storage | 媒体与文件存储 |

> 备注：后端由 Supabase 托管。前端通过环境变量或直接在 `src/services/supabase.js` 配置 Supabase 项目连接信息。

## 📁 项目结构（项目根）

```
the-wild-oasis/
├── index.html
├── package.json
├── vite.config.js
├── public/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── context/
│   ├── data/
│   ├── features/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   │   └── supabase.js
│   └── ui/
└── README.md
```

（项目内主要目录：`src/features` 为功能模块，`src/ui` 为可复用组件，`src/services/supabase.js` 为 Supabase 客户端初始化点。）

## 本地运行

### 前置条件

- Node.js >= 18

### 安装与运行

```bash
git clone <your-repo-url>
cd the-wild-oasis
npm install
npm run dev
```

默认开发服务器由 Vite 启动，前端会通过 `src/services/supabase.js` 中的 Supabase 配置与数据库交互。推荐将 Supabase 配置迁移到环境变量（示例：`VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`）。

## 部署建议

- 前端：Vercel / Netlify（直接部署 Vite 应用）
- 后端：Supabase（托管 Postgres、Auth、Storage）

示例环境变量：

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 贡献

欢迎提交 issue 或 PR：

1. Fork 仓库
2. 新建分支 `feature/xxx`
3. 提交并推送
4. 发起 PR

## 许可证

本项目遵循 MIT 许可证。
