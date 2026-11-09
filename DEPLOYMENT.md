# N Admin 部署指南

N Admin 基于 Next.js 16，使用 MySQL 协议数据库和 Drizzle ORM。推荐的生产组合是 Vercel + TiDB Cloud Starter，也可部署到任何支持 Node.js 的服务器。

## 环境要求

- Node.js 20.9 或更高版本
- pnpm 9.15
- MySQL 8+ 或 TiDB Cloud Starter

## 本地开发

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm db:push
pnpm init:admin
pnpm dev
```

修改 `.env.local` 中的数据库、JWT 和初始管理员配置。不要将真实凭据提交到 Git。

## Vercel + TiDB Cloud

### 1. 创建数据库

在 TiDB Cloud Starter 中创建 Cluster 和数据库，然后在 Connect 页面获取 Host、Port、Username 和 Password。生产环境建议单独创建应用用户，不要使用 Root 账户。

将 TiDB Cloud 的 Network Access 设置为允许 Vercel 访问。Vercel 函数默认不保证固定出口 IP，使用 IP 白名单时需选择与当前 Vercel 方案兼容的网络配置。

### 2. 配置 Vercel 环境变量

在 Project Settings > Environment Variables 中配置：

```dotenv
DATABASE_HOST=gateway01.<region>.prod.aws.tidbcloud.com
DATABASE_PORT=4000
DATABASE_USERNAME=<username>
DATABASE_PASSWORD=<password>
DATABASE_NAME=n_admin
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=true

JWT_SECRET=<at-least-32-random-characters>

ADMIN_EMAIL=admin@example.com
ADMIN_USERNAME=Administrator
ADMIN_PASSWORD=<strong-initial-password>
SALT_ROUNDS=12
```

`JWT_SECRET` 可使用 `openssl rand -base64 48` 生成。生产环境不应使用 `.env.example` 中的示例值。

### 3. 初始化 Schema 和管理员

Vercel 的普通构建流程不适合自动修改生产数据库。在可信任的本地终端或受控 CI 环境中加载生产环境变量，然后执行：

```bash
pnpm install --frozen-lockfile
pnpm db:push
pnpm init:admin
```

`pnpm init:admin` 可重复执行，它用于初始化默认权限、角色和超级管理员。初次登录后应立即更换初始密码。

### 4. 发布

将 GitHub 仓库连接到 Vercel 后，推送 `main` 分支即会触发生产构建。每次发布前运行：

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

对包含 `drizzle/` 变更的版本，先备份数据库并执行 `pnpm db:push`，再切换生产流量。

## 独立服务器部署

`pnpm build` 会生成 Next.js standalone 产物。GitHub Release 中的 `n-admin.zip` 已包含运行时依赖：

```bash
unzip n-admin.zip -d n-admin
cd n-admin
cp .env.example .env
# 编辑 .env，填入生产配置
HOSTNAME=0.0.0.0 PORT=3000 node server.js
```

运行 Schema 同步或管理员初始化时，请使用源码仓库和完整开发依赖执行相应的 pnpm 命令。

## 健康检查

发布后至少验证：

1. `/login` 可正常访问并完成登录。
2. `/dashboard/overview` 可读取统计数据。
3. 用户、角色、权限和日志页面的读写权限正确。
4. Vercel Functions 日志中没有数据库 TLS、超时或连接数错误。
5. 禁用或删除用户后，其现有会话会在下一次请求时失效。

## 常见问题

### 数据库连接失败

- 确认 Host、Port、Username、Password 和 Database 均为同一个 Cluster 的值。
- TiDB Cloud 必须启用 `DATABASE_SSL=true`。
- 检查 Network Access 和 Vercel 出口网络限制。
- 连接数达到上限时，查看 TiDB Cloud 监控并减少并发请求。

### 登录后立即退出

- 检查所有 Vercel 环境的 `JWT_SECRET` 是否一致。
- 确认用户未被删除或禁用。
- 检查浏览器是否允许 HTTPS 站点写入 Cookie。

### Schema 不一致

备份数据库后，使用与当前版本匹配的代码执行 `pnpm db:push`。不要在生产构建命令中每次自动执行 Schema 修改。
