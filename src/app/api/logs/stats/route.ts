import { NextRequest } from 'next/server';
import { db } from '@/db';
import { systemLogs } from '@/db/schema';
import { count, eq, sql, gte } from 'drizzle-orm';
import { authorizeApiRequest } from '@/lib/api-authorization';
import { PERMISSIONS } from '@/lib/permissions';
import { errorResponse, successResponse } from '@/service/response';

export async function GET(request: NextRequest) {
  const authorization = await authorizeApiRequest(
    request,
    PERMISSIONS.LOG.READ
  );
  if (!authorization.authorized) return authorization.response;

  try {
    // 获取今天的开始时间
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 获取本周的开始时间
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
    thisWeek.setHours(0, 0, 0, 0);

    // 统计总日志数
    const [totalLogs] = await db.select({ count: count() }).from(systemLogs);

    // 统计今日日志数
    const [todayLogs] = await db
      .select({ count: count() })
      .from(systemLogs)
      .where(gte(systemLogs.createdAt, today));

    // 统计本周日志数
    const [weekLogs] = await db
      .select({ count: count() })
      .from(systemLogs)
      .where(gte(systemLogs.createdAt, thisWeek));

    // 按级别统计
    const levelStats = await db
      .select({
        level: systemLogs.level,
        count: count()
      })
      .from(systemLogs)
      .groupBy(systemLogs.level);

    // 按模块统计
    const moduleStats = await db
      .select({
        module: systemLogs.module,
        count: count()
      })
      .from(systemLogs)
      .groupBy(systemLogs.module)
      .orderBy(sql`count(*) DESC`)
      .limit(10);

    // 最近7天的日志趋势
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyTrend = await db
      .select({
        date: sql<string>`DATE(${systemLogs.createdAt})`,
        count: count()
      })
      .from(systemLogs)
      .where(gte(systemLogs.createdAt, sevenDaysAgo))
      .groupBy(sql`DATE(${systemLogs.createdAt})`)
      .orderBy(sql`DATE(${systemLogs.createdAt})`);

    return successResponse({
      overview: {
        total: totalLogs.count,
        today: todayLogs.count,
        week: weekLogs.count
      },
      levelStats: levelStats.map((stat) => ({
        level: stat.level,
        count: stat.count
      })),
      moduleStats: moduleStats.map((stat) => ({
        module: stat.module,
        count: stat.count
      })),
      weeklyTrend: weeklyTrend.map((item) => ({
        date: item.date,
        count: item.count
      }))
    });
  } catch (error) {
    console.error('获取日志统计失败:', error);
    return errorResponse('获取日志统计失败');
  }
}
