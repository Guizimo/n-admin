import { NextRequest } from 'next/server';
import { db } from '@/db';
import { systemLogs, users } from '@/db/schema';
import { desc, eq, like, and, gte, lte, count } from 'drizzle-orm';
import { authorizeApiRequest } from '@/lib/api-authorization';
import { PERMISSIONS } from '@/lib/permissions';
import { successResponse, errorResponse } from '@/service/response';

export async function GET(request: NextRequest) {
  const authorization = await authorizeApiRequest(
    request,
    PERMISSIONS.LOG.READ
  );
  if (!authorization.authorized) return authorization.response;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const level = searchParams.get('level');
    const module = searchParams.get('module');
    const action = searchParams.get('action');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');

    // 构建查询条件
    const conditions = [];

    if (level) {
      conditions.push(eq(systemLogs.level, level));
    }

    if (module) {
      conditions.push(eq(systemLogs.module, module));
    }

    if (action) {
      conditions.push(like(systemLogs.action, `%${action}%`));
    }

    if (search) {
      conditions.push(like(systemLogs.message, `%${search}%`));
    }

    if (startDate) {
      conditions.push(gte(systemLogs.createdAt, new Date(startDate)));
    }

    if (endDate) {
      conditions.push(lte(systemLogs.createdAt, new Date(endDate)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 获取总数
    const [totalResult] = await db
      .select({ count: count() })
      .from(systemLogs)
      .where(whereClause);

    const total = totalResult.count;

    // 获取日志列表
    const logs = await db
      .select({
        id: systemLogs.id,
        level: systemLogs.level,
        action: systemLogs.action,
        module: systemLogs.module,
        message: systemLogs.message,
        details: systemLogs.details,
        userId: systemLogs.userId,
        username: users.username,
        userAgent: systemLogs.userAgent,
        ip: systemLogs.ip,
        requestId: systemLogs.requestId,
        duration: systemLogs.duration,
        createdAt: systemLogs.createdAt
      })
      .from(systemLogs)
      .leftJoin(users, eq(systemLogs.userId, users.id))
      .where(whereClause)
      .orderBy(desc(systemLogs.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    return successResponse(logs, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('获取日志失败:', error);
    return errorResponse('获取日志失败');
  }
}

export async function DELETE(request: NextRequest) {
  const authorization = await authorizeApiRequest(
    request,
    PERMISSIONS.LOG.DELETE
  );
  if (!authorization.authorized) return authorization.response;

  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // 删除指定天数之前的日志
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    await db.delete(systemLogs).where(lte(systemLogs.createdAt, cutoffDate));

    return successResponse({
      message: `成功删除 ${days} 天前的日志`
    });
  } catch (error) {
    console.error('删除日志失败:', error);
    return errorResponse('删除日志失败');
  }
}
