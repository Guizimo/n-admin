<div align="center">
  <img src="public/logo.png" alt="N Admin Logo" width="112" height="112">

# N Admin

可解释、可审计、可执行的 AI Native 管理操作系统。

[简体中文](README.md) | [English](README.en.md)

[![Release](https://img.shields.io/github/v/release/Guizimo/n-admin?style=flat-square)](https://github.com/Guizimo/n-admin/releases)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/github/license/Guizimo/n-admin?style=flat-square)](LICENSE)

</div>

## 项目简介

N Admin 是一个基于 Next.js 16、React 19、Drizzle ORM 和 MySQL 构建的开源管理系统。它提供用户、角色、权限、日志与数据看板等后台基础能力，并正在向能够理解系统状态、解释判断依据和安全执行操作的 AI Native 软件演进。

当前版本：`v0.3.0`

## 当前能力

| 模块     | 能力                                                     |
| -------- | -------------------------------------------------------- |
| AI 洞察  | 分析用户、权限和操作日志，输出结构化风险、证据与处置建议 |
| 数据看板 | 关键指标、用户趋势、系统状态与洞察汇总                   |
| 用户管理 | 用户增删改查、状态管理与角色分配                         |
| 角色权限 | 分层权限树、角色授权与细粒度 RBAC 控制                   |
| 系统日志 | 操作记录、条件筛选、详情查看与统计                       |
| 使用体验 | 响应式布局、明暗主题、命令搜索与加载状态                 |

## AI Native 方向

N Admin 不只展示数据，还希望形成一条完整的管理决策链：

1. 理解用户、角色、权限、日志和业务状态。
2. 生成带置信度与证据引用的判断。
3. 提供影响范围明确、可以回退的操作草案。
4. 经过权限校验和人工确认后执行，并保留完整审计记录。

目前已完成 AI 洞察基线，Provider 抽象、带证据的管理 Copilot 和受控 AI 行动仍在持续开发中。

## 技术栈

- Next.js 16 App Router、React 19、TypeScript
- Tailwind CSS 4、shadcn/ui、Radix UI、Lucide
- Drizzle ORM、MySQL
- JWT、bcryptjs、细粒度 RBAC
- Zustand、TanStack Table、Recharts、nuqs
- ESLint、Prettier、Husky、Commitizen

## 快速开始

### 环境要求

- Node.js >= 20.9
- pnpm >= 9
- MySQL 8 或兼容服务

### 安装与运行

```bash
git clone https://github.com/Guizimo/n-admin.git
cd n-admin

pnpm install
cp .env.example .env
```

创建数据库：

```sql
CREATE DATABASE n_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

修改 `.env` 中的数据库连接和安全配置，然后初始化并启动项目：

```bash
pnpm db:push
pnpm init:admin
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000)。管理员账号由 `.env` 中的 `ADMIN_EMAIL` 和 `ADMIN_PASSWORD` 决定。

> 在生产环境中务必使用高强度 `JWT_SECRET` 和管理员密码，不要保留示例凭据。

## 环境变量

| 变量                          | 是否必需   | 说明                     |
| ----------------------------- | ---------- | ------------------------ |
| `NEXT_PUBLIC_APP_NAME`        | 否         | 应用名称，默认 `N Admin` |
| `NEXT_PUBLIC_APP_DESCRIPTION` | 否         | 应用描述                 |
| `DATABASE_HOST`               | 是         | MySQL 主机地址           |
| `DATABASE_PORT`               | 否         | MySQL 端口，默认 `3306`  |
| `DATABASE_USERNAME`           | 是         | MySQL 用户名             |
| `DATABASE_PASSWORD`           | 是         | MySQL 密码               |
| `DATABASE_NAME`               | 是         | MySQL 数据库名           |
| `JWT_SECRET`                  | 生产必需   | JWT 签名密钥             |
| `ADMIN_EMAIL`                 | 初始化必需 | 初始超级管理员邮箱       |
| `ADMIN_USERNAME`              | 初始化必需 | 初始超级管理员名称       |
| `ADMIN_PASSWORD`              | 初始化必需 | 初始超级管理员密码       |
| `SALT_ROUNDS`                 | 否         | bcrypt 轮数，默认 `12`   |

完整示例见 [.env.example](.env.example)。

## 常用命令

| 命令               | 说明                         |
| ------------------ | ---------------------------- |
| `pnpm dev`         | 启动开发服务器               |
| `pnpm build`       | 构建生产版本                 |
| `pnpm start`       | 启动生产服务器               |
| `pnpm lint`        | 运行 ESLint                  |
| `pnpm db:generate` | 生成数据库迁移               |
| `pnpm db:push`     | 将 Schema 同步到数据库       |
| `pnpm db:studio`   | 启动 Drizzle Studio          |
| `pnpm init:admin`  | 初始化权限、角色和超级管理员 |
| `pnpm commit`      | 使用 Commitizen 创建规范提交 |

## 项目结构

```text
src/
├── app/              # 页面、布局与 API Routes
├── components/       # UI、布局和业务组件
├── config/           # 应用配置
├── contexts/         # React 上下文
├── db/               # Drizzle Schema 与数据库连接
├── hooks/            # 自定义 Hooks
├── lib/              # 认证、权限、日志等服务端能力
├── service/          # 前端 API 客户端
├── stores/           # Zustand 状态
└── types/            # TypeScript 类型
```

## 部署

推荐使用 Vercel：将 GitHub 仓库导入 Vercel，配置与 `.env.example` 对应的环境变量，并确保部署环境能够访问 MySQL。推送到生产分支后即可自动构建和发布。

其他部署环境可执行：

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

## 贡献

欢迎提交 Issue、讨论和 Pull Request。开始开发前请阅读 [提交指南](docs/commit-guide.md)，权限模型说明见 [权限文档](src/docs/permissions.md)。

## 版本与许可

- [更新日志](CHANGELOG.md)
- [GitHub Releases](https://github.com/Guizimo/n-admin/releases)
- [MIT License](LICENSE)
