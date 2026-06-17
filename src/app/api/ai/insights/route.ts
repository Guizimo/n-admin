import { db } from '@/db';
import {
  permissions,
  rolePermissions,
  roles,
  systemLogs,
  users
} from '@/db/schema';
import { getUserFromRequest } from '@/lib/server-permissions';
import {
  errorResponse,
  successResponse,
  unauthorizedResponse
} from '@/service/response';
import type { AiActionDraft, AiInsight, AiInsightsPayload } from '@/types/ai';
import { and, count, desc, eq, gte, isNull, like, or, sql } from 'drizzle-orm';

const DAY_MS = 24 * 60 * 60 * 1000;

function getSeverityByCount(countValue: number, medium: number, high: number) {
  if (countValue >= high) {
    return 'high';
  }

  if (countValue >= medium) {
    return 'medium';
  }

  return 'low';
}

function getHealthScore(insights: AiInsight[]) {
  const penalty = insights.reduce((total, insight) => {
    if (insight.severity === 'high') return total + 22;
    if (insight.severity === 'medium') return total + 12;
    return total + 5;
  }, 0);

  return Math.max(0, 100 - penalty);
}

function buildSummary(score: number, highRiskCount: number) {
  if (score >= 85) {
    return '系统整体状态稳定，可以重点关注权限治理和日志留存策略。';
  }

  if (highRiskCount > 0) {
    return '系统存在需要优先处理的高风险信号，建议先从登录异常和权限暴露面开始收敛。';
  }

  return '系统存在一些可优化项，建议按影响面逐步处理，避免积累成权限和审计债务。';
}

function buildActionDrafts(insights: AiInsight[]): AiActionDraft[] {
  return insights.slice(0, 3).map((insight) => ({
    id: `draft-${insight.id}`,
    title: `处理建议：${insight.title}`,
    description: insight.recommendation,
    steps: [
      '复核洞察证据和影响范围',
      '在对应模块筛选相关用户、角色或日志',
      '执行变更前保留审计记录',
      '完成后再次刷新 AI 洞察确认风险下降'
    ],
    requiresApproval: insight.severity !== 'low'
  }));
}

export async function GET() {
  try {
    const userId = await getUserFromRequest();
    if (!userId) {
      return unauthorizedResponse('未授权');
    }

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - DAY_MS);
    const sevenDaysAgo = new Date(now.getTime() - 7 * DAY_MS);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * DAY_MS);

    const [
      totalUsersResult,
      disabledUsersResult,
      inactiveAdminUsers,
      recentErrorsResult,
      recentWarningsResult,
      failedLoginResult,
      highLatencyResult,
      topRiskIps,
      totalRolesResult,
      totalPermissionsResult,
      emptyRoleResult,
      orphanPermissionResult,
      superRoleResult
    ] = await Promise.all([
      db.select({ count: count() }).from(users),
      db
        .select({ count: count() })
        .from(users)
        .where(eq(users.status, 'disabled')),
      db
        .select({
          id: users.id,
          username: users.username,
          email: users.email,
          lastLoginAt: users.lastLoginAt,
          roleName: roles.name
        })
        .from(users)
        .innerJoin(roles, eq(users.roleId, roles.id))
        .where(
          and(
            or(eq(roles.isSuper, true), eq(users.isSuperAdmin, true)),
            or(
              isNull(users.lastLoginAt),
              sql`${users.lastLoginAt} < ${thirtyDaysAgo}`
            )
          )
        )
        .limit(5),
      db
        .select({ count: count() })
        .from(systemLogs)
        .where(
          and(
            eq(systemLogs.level, 'error'),
            gte(systemLogs.createdAt, sevenDaysAgo)
          )
        ),
      db
        .select({ count: count() })
        .from(systemLogs)
        .where(
          and(
            eq(systemLogs.level, 'warn'),
            gte(systemLogs.createdAt, sevenDaysAgo)
          )
        ),
      db
        .select({ count: count() })
        .from(systemLogs)
        .where(
          and(
            gte(systemLogs.createdAt, sevenDaysAgo),
            or(
              like(systemLogs.message, '%登录失败%'),
              like(systemLogs.message, '%密码错误%'),
              like(systemLogs.message, '%用户不存在%')
            )
          )
        ),
      db
        .select({ count: count() })
        .from(systemLogs)
        .where(
          and(
            gte(systemLogs.createdAt, oneDayAgo),
            sql`${systemLogs.duration} > 1000`
          )
        ),
      db
        .select({
          ip: systemLogs.ip,
          count: count()
        })
        .from(systemLogs)
        .where(
          and(
            gte(systemLogs.createdAt, sevenDaysAgo),
            or(
              like(systemLogs.message, '%登录失败%'),
              like(systemLogs.message, '%密码错误%'),
              like(systemLogs.message, '%用户不存在%')
            )
          )
        )
        .groupBy(systemLogs.ip)
        .orderBy(desc(count()))
        .limit(3),
      db.select({ count: count() }).from(roles),
      db.select({ count: count() }).from(permissions),
      db
        .select({
          id: roles.id,
          name: roles.name
        })
        .from(roles)
        .leftJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
        .where(isNull(rolePermissions.permissionId))
        .limit(5),
      db
        .select({
          id: permissions.id,
          name: permissions.name,
          code: permissions.code
        })
        .from(permissions)
        .leftJoin(
          rolePermissions,
          eq(permissions.id, rolePermissions.permissionId)
        )
        .where(isNull(rolePermissions.roleId))
        .limit(5),
      db.select({ count: count() }).from(roles).where(eq(roles.isSuper, true))
    ]);

    const totalUsers = totalUsersResult[0]?.count || 0;
    const disabledUsers = disabledUsersResult[0]?.count || 0;
    const recentErrors = recentErrorsResult[0]?.count || 0;
    const recentWarnings = recentWarningsResult[0]?.count || 0;
    const failedLogins = failedLoginResult[0]?.count || 0;
    const highLatencyLogs = highLatencyResult[0]?.count || 0;
    const totalRoles = totalRolesResult[0]?.count || 0;
    const totalPermissions = totalPermissionsResult[0]?.count || 0;
    const superRoles = superRoleResult[0]?.count || 0;

    const insights: AiInsight[] = [];

    if (failedLogins > 0) {
      insights.push({
        id: 'failed-login-risk',
        title: '登录失败风险',
        summary: `近 7 天检测到 ${failedLogins} 次登录失败相关日志。`,
        severity: getSeverityByCount(failedLogins, 5, 15),
        evidence: [
          `失败登录日志：${failedLogins} 条`,
          ...topRiskIps
            .filter((item) => item.ip)
            .map((item) => `IP ${item.ip} 触发 ${item.count} 次`)
        ],
        recommendation:
          '建议筛选登录失败日志，确认是否需要限制高频 IP 或临时禁用异常账号。'
      });
    }

    if (recentErrors + recentWarnings > 0) {
      insights.push({
        id: 'log-quality-risk',
        title: '系统异常日志',
        summary: `近 7 天共有 ${recentErrors} 条错误和 ${recentWarnings} 条警告。`,
        severity:
          recentErrors > 0 ? getSeverityByCount(recentErrors, 3, 10) : 'low',
        evidence: [
          `错误日志：${recentErrors} 条`,
          `警告日志：${recentWarnings} 条`
        ],
        recommendation:
          '建议先处理 error 级日志，再观察 warn 是否集中在同一模块或操作。'
      });
    }

    if (inactiveAdminUsers.length > 0) {
      insights.push({
        id: 'inactive-admin-risk',
        title: '高权限账号沉睡',
        summary: `${inactiveAdminUsers.length} 个高权限账号超过 30 天未登录或从未登录。`,
        severity: 'medium',
        evidence: inactiveAdminUsers.map(
          (user) => `${user.username} (${user.roleName || '超级管理员'})`
        ),
        recommendation: '建议复核这些账号是否仍需保留高权限，必要时降权或禁用。'
      });
    }

    if (emptyRoleResult.length > 0 || orphanPermissionResult.length > 0) {
      insights.push({
        id: 'permission-governance',
        title: '权限模型可治理',
        summary: `发现 ${emptyRoleResult.length} 个空角色和 ${orphanPermissionResult.length} 个未分配权限。`,
        severity: 'low',
        evidence: [
          ...emptyRoleResult.map((role) => `空角色：${role.name}`),
          ...orphanPermissionResult.map(
            (permission) => `未分配权限：${permission.name}`
          )
        ],
        recommendation: '建议清理无效角色，并确认未分配权限是否属于预留能力。'
      });
    }

    if (highLatencyLogs > 0) {
      insights.push({
        id: 'latency-risk',
        title: '慢操作信号',
        summary: `近 24 小时有 ${highLatencyLogs} 条操作耗时超过 1000ms。`,
        severity: getSeverityByCount(highLatencyLogs, 5, 20),
        evidence: [`慢操作日志：${highLatencyLogs} 条`],
        recommendation:
          '建议结合 requestId 追踪慢操作来源，优先检查数据库查询和外部依赖。'
      });
    }

    if (insights.length === 0) {
      insights.push({
        id: 'stable-baseline',
        title: '运行状态稳定',
        summary: '当前没有检测到明显的登录、日志或权限治理风险。',
        severity: 'low',
        evidence: ['近 7 天未发现关键风险信号'],
        recommendation: '建议保持每周复盘节奏，持续观察权限变更和异常登录趋势。'
      });
    }

    const healthScore = getHealthScore(insights);
    const highRiskCount = insights.filter(
      (insight) => insight.severity === 'high'
    ).length;

    const payload: AiInsightsPayload = {
      generatedAt: now.toISOString(),
      healthScore,
      summary: buildSummary(healthScore, highRiskCount),
      insights,
      actionDrafts: buildActionDrafts(insights),
      permissionExplanation: {
        title: '当前权限模型解释',
        summary: `系统中共有 ${totalRoles} 个角色、${totalPermissions} 个权限节点，超级角色 ${superRoles} 个。`,
        details: [
          `用户总数 ${totalUsers}，禁用用户 ${disabledUsers}`,
          '普通用户通过角色获得权限，超级管理员可获得完整权限集合。',
          'AI 建议优先维护最小权限角色，并定期检查空角色、沉睡高权限账号和未分配权限。'
        ]
      }
    };

    return successResponse(payload);
  } catch (error) {
    console.error('获取 AI 洞察失败:', error);
    return errorResponse('获取 AI 洞察失败');
  }
}
