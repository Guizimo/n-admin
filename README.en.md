<div align="center">
  <img src="public/logo.png" alt="N Admin Logo" width="112" height="112">

# N Admin

An explainable, auditable, and actionable AI-native administration system.

[简体中文](README.md) | [English](README.en.md)

[![Release](https://img.shields.io/github/v/release/Guizimo/n-admin?style=flat-square)](https://github.com/Guizimo/n-admin/releases)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/github/license/Guizimo/n-admin?style=flat-square)](LICENSE)

</div>

## Overview

N Admin is an open-source administration system built with Next.js 16, React 19, Drizzle ORM, and MySQL. It provides the foundations of an admin application, including users, roles, permissions, audit logs, and dashboards, while evolving toward AI-native software that can understand system state, explain its reasoning, and execute actions safely.

## Current Capabilities

| Module                | Capabilities                                                                                               |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| AI insights           | Analyzes users, permissions, and operation logs to produce structured risks, evidence, and recommendations |
| Dashboard             | Key metrics, user trends, system status, and insight summaries                                             |
| User management       | User CRUD, status management, and role assignment                                                          |
| Roles and permissions | Hierarchical permission trees, role grants, and fine-grained RBAC                                          |
| Audit logs            | Operation history, filtering, detail views, and statistics                                                 |
| Experience            | Responsive layouts, light and dark themes, command search, and loading states                              |

## AI-Native Direction

N Admin aims to go beyond presenting data and build a complete administrative decision loop:

1. Understand users, roles, permissions, logs, and business state.
2. Produce conclusions with confidence levels and cited evidence.
3. Propose reversible actions with a clearly defined impact scope.
4. Execute after permission checks and human approval while preserving a complete audit trail.

The AI insights baseline is available today. Provider abstraction, an evidence-backed administration copilot, and controlled AI actions are still under active development.

## Technology Stack

- Next.js 16 App Router, React 19, and TypeScript
- Tailwind CSS 4, shadcn/ui, Radix UI, and Lucide
- Drizzle ORM and MySQL
- JWT, bcryptjs, and fine-grained RBAC
- Zustand, TanStack Table, Recharts, and nuqs
- ESLint, Prettier, Husky, and Commitizen

## Quick Start

### Requirements

- Node.js >= 20.9
- pnpm >= 9
- MySQL 8 or a compatible service

### Install and Run

```bash
git clone https://github.com/Guizimo/n-admin.git
cd n-admin

pnpm install
cp .env.example .env
```

Create the database:

```sql
CREATE DATABASE n_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Update the database and security settings in `.env`, then initialize and start the application:

```bash
pnpm db:push
pnpm init:admin
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The administrator credentials are defined by `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`.

> Always use a strong `JWT_SECRET` and administrator password in production. Do not keep the example credentials.

## Environment Variables

| Variable                      | Required       | Description                             |
| ----------------------------- | -------------- | --------------------------------------- |
| `NEXT_PUBLIC_APP_NAME`        | No             | Application name; defaults to `N Admin` |
| `NEXT_PUBLIC_APP_DESCRIPTION` | No             | Application description                 |
| `DATABASE_HOST`               | Yes            | MySQL host                              |
| `DATABASE_PORT`               | No             | MySQL port; defaults to `3306`          |
| `DATABASE_USERNAME`           | Yes            | MySQL username                          |
| `DATABASE_PASSWORD`           | Yes            | MySQL password                          |
| `DATABASE_NAME`               | Yes            | MySQL database name                     |
| `JWT_SECRET`                  | Production     | JWT signing secret                      |
| `ADMIN_EMAIL`                 | Initialization | Initial super administrator email       |
| `ADMIN_USERNAME`              | Initialization | Initial super administrator name        |
| `ADMIN_PASSWORD`              | Initialization | Initial super administrator password    |
| `SALT_ROUNDS`                 | No             | bcrypt cost factor; defaults to `12`    |

See [.env.example](.env.example) for a complete example.

## Common Commands

| Command            | Description                                                |
| ------------------ | ---------------------------------------------------------- |
| `pnpm dev`         | Start the development server                               |
| `pnpm build`       | Create a production build                                  |
| `pnpm start`       | Start the production server                                |
| `pnpm lint`        | Run ESLint                                                 |
| `pnpm db:generate` | Generate database migrations                               |
| `pnpm db:push`     | Synchronize the schema with the database                   |
| `pnpm db:studio`   | Start Drizzle Studio                                       |
| `pnpm init:admin`  | Initialize permissions, roles, and the super administrator |
| `pnpm commit`      | Create a conventional commit with Commitizen               |

## Project Structure

```text
src/
├── app/              # Pages, layouts, and API routes
├── components/       # UI, layout, and domain components
├── config/           # Application configuration
├── contexts/         # React contexts
├── db/               # Drizzle schema and database connection
├── hooks/            # Custom hooks
├── lib/              # Authentication, permissions, logging, and server utilities
├── service/          # Frontend API clients
├── stores/           # Zustand stores
└── types/            # TypeScript types
```

## Deployment

Vercel is the recommended deployment target. Import the GitHub repository, configure the environment variables from `.env.example`, and make sure the deployment environment can access MySQL. Pushes to the production branch will then build and deploy automatically.

For other deployment environments, run:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

## Contributing

Issues, discussions, and pull requests are welcome. Read the [commit guide](docs/commit-guide.md) before contributing. The [permissions documentation](src/docs/permissions.md) describes the authorization model.

## Releases and License

- [Changelog](CHANGELOG.md)
- [GitHub Releases](https://github.com/Guizimo/n-admin/releases)
- [MIT License](LICENSE)
