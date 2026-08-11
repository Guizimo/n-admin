import { db } from '@/db';
import { roles, users } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { eq, like, and, gte, lte, sql } from 'drizzle-orm';
import { Logger } from '@/lib/logger';
import { authorizeApiRequest } from '@/lib/api-authorization';
import { PERMISSIONS } from '@/lib/permissions';
import { successResponse, errorResponse } from '@/service/response';

export async function GET(request: Request) {
  const authorization = await authorizeApiRequest(
    request,
    PERMISSIONS.USER.READ
  );
  if (!authorization.authorized) return authorization.response;

  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const email = searchParams.get('email');
    const roleId = searchParams.get('roleId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // 构建查询条件
    const conditions = [];

    if (username) {
      conditions.push(like(users.username, `%${username}%`));
    }

    if (email) {
      conditions.push(like(users.email, `%${email}%`));
    }

    if (roleId) {
      conditions.push(eq(users.roleId, parseInt(roleId)));
    }

    if (status && status !== 'all') {
      conditions.push(eq(users.status, status));
    }

    if (startDate) {
      conditions.push(gte(users.createdAt, new Date(startDate)));
    }

    if (endDate) {
      conditions.push(lte(users.createdAt, new Date(endDate)));
    }

    const baseQuery = db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        roleId: users.roleId,
        avatar: users.avatar,
        status: users.status,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
        isSuperAdmin: users.isSuperAdmin,
        role: {
          id: roles.id,
          name: roles.name
        }
      })
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id));

    // 计算总数
    const countQuery = db
      .select({ count: sql`count(*)` })
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id));

    const [userList, totalResult] = await Promise.all([
      conditions.length > 0
        ? baseQuery
            .where(and(...conditions))
            .limit(limit)
            .offset((page - 1) * limit)
        : baseQuery.limit(limit).offset((page - 1) * limit),
      conditions.length > 0 ? countQuery.where(and(...conditions)) : countQuery
    ]);

    const total = totalResult[0]?.count || 0;

    return successResponse(userList, {
      page,
      limit,
      total: Number(total),
      totalPages: Math.ceil(Number(total) / limit)
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return errorResponse('获取用户列表失败');
  }
}

export async function POST(request: Request) {
  const authorization = await authorizeApiRequest(
    request,
    PERMISSIONS.USER.CREATE
  );
  if (!authorization.authorized) return authorization.response;

  const currentUser = authorization.user;
  const logger = new Logger('用户管理', currentUser.id);

  try {
    const body = await request.json();
    const { username, email, password, roleId, status = 'active' } = body;

    // 验证必填字段
    if (!username || !email || !password) {
      await logger.warn('创建用户', '创建用户失败：缺少必填字段', {
        missingFields: {
          username: !username,
          email: !email,
          password: !password
        },
        operatorId: currentUser?.id,
        operatorName: currentUser?.username
      });

      return errorResponse('请填写所有必填字段');
    }

    // 检查用户名或邮箱是否已存在
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUser.length > 0) {
      await logger.warn('创建用户', '创建用户失败：用户名已存在', {
        username,
        email,
        operatorId: currentUser?.id,
        operatorName: currentUser?.username
      });

      return errorResponse('用户名已存在');
    }

    // 加密密码
    const saltRounds = Number(process.env.SALT_ROUNDS || 12);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 创建用户
    await db.insert(users).values({
      username,
      email,
      password: hashedPassword,
      roleId,
      status,
      avatar: `/avatars/default.jpg`
    });

    // 记录成功日志
    await logger.info('创建用户', '用户创建成功', {
      username,
      email,
      roleId,
      operatorId: currentUser?.id,
      operatorName: currentUser?.username,
      timestamp: new Date().toISOString()
    });

    return successResponse({ message: '用户创建成功' });
  } catch (error) {
    await logger.error('创建用户', '创建用户失败：系统错误', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      operatorId: currentUser?.id,
      operatorName: currentUser?.username
    });

    console.error('创建用户失败:', error);
    return errorResponse('创建用户失败');
  }
}
