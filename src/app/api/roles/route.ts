import { db } from '@/db';
import { roles, users } from '@/db/schema';
import { like, and, gte, lte, count, eq, sql } from 'drizzle-orm';
import { Logger } from '@/lib/logger';
import { authorizeApiRequest } from '@/lib/api-authorization';
import { PERMISSIONS } from '@/lib/permissions';
import { successResponse, errorResponse } from '@/service/response';

export async function GET(request: Request) {
  const authorization = await authorizeApiRequest(
    request,
    PERMISSIONS.ROLE.READ
  );
  if (!authorization.authorized) return authorization.response;

  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // 验证分页参数
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100); // 限制最大100条
    const offset = (validPage - 1) * validLimit;

    // 构建查询条件
    const conditions = [];

    if (name) {
      conditions.push(like(roles.name, `%${name}%`));
    }

    if (startDate) {
      conditions.push(gte(roles.createdAt, new Date(startDate)));
    }

    if (endDate) {
      conditions.push(lte(roles.createdAt, new Date(endDate)));
    }

    // 构建基础查询
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 获取总数
    const [totalResult] = await db
      .select({ count: count() })
      .from(roles)
      .where(whereClause);

    const total = totalResult.count;

    // 获取分页数据（包含用户数量）
    const baseQuery = db
      .select({
        id: roles.id,
        name: roles.name,
        description: roles.description,
        isSuper: roles.isSuper,
        createdAt: roles.createdAt,
        updatedAt: roles.updatedAt,
        userCount: sql<number>`count(${users.id})`.as('userCount')
      })
      .from(roles)
      .leftJoin(users, eq(roles.id, users.roleId))
      .groupBy(
        roles.id,
        roles.name,
        roles.description,
        roles.isSuper,
        roles.createdAt,
        roles.updatedAt
      );

    const query = whereClause ? baseQuery.where(whereClause) : baseQuery;

    const roleList = await query
      .limit(validLimit)
      .offset(offset)
      .orderBy(roles.createdAt);

    // 计算分页信息
    const totalPages = Math.ceil(total / validLimit);

    return successResponse(roleList, {
      page: validPage,
      limit: validLimit,
      total,
      totalPages
    });
  } catch (error) {
    console.error('获取角色列表失败:', error);
    return errorResponse('获取角色列表失败');
  }
}

export async function POST(request: Request) {
  const authorization = await authorizeApiRequest(
    request,
    PERMISSIONS.ROLE.CREATE
  );
  if (!authorization.authorized) return authorization.response;

  const currentUser = authorization.user;
  const logger = new Logger('角色管理', currentUser.id);

  try {
    const body = await request.json();
    const { name, description } = body;

    // 验证必填字段
    if (!name) {
      await logger.warn('创建角色', '创建角色失败：缺少角色名称', {
        operatorId: currentUser?.id,
        operatorName: currentUser?.username
      });
      return errorResponse('角色名称不能为空');
    }

    // 检查角色名是否已存在
    const existingRole = await db
      .select()
      .from(roles)
      .where(eq(roles.name, name))
      .limit(1);

    if (existingRole.length > 0) {
      await logger.warn('创建角色', '创建角色失败：角色名已存在', {
        roleName: name,
        operatorId: currentUser?.id,
        operatorName: currentUser?.username
      });
      return errorResponse('角色名已存在');
    }

    await db.insert(roles).values({
      name,
      description
    });

    // 记录创建成功日志
    await logger.info('创建角色', '角色创建成功', {
      roleName: name,
      description,
      operatorId: currentUser?.id,
      operatorName: currentUser?.username,
      timestamp: new Date().toISOString()
    });

    return successResponse({ message: '角色创建成功' });
  } catch (error) {
    await logger.error('创建角色', '创建角色失败：系统错误', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      operatorId: currentUser?.id,
      operatorName: currentUser?.username
    });

    console.error('创建角色失败:', error);
    return errorResponse('创建角色失败');
  }
}
