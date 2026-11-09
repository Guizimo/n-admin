import { db } from '@/db';
import { roles, users } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { eq, like, and, gte, lte, or, sql } from 'drizzle-orm';
import { Logger } from '@/lib/logger';
import { authorizeApiRequest } from '@/lib/api-authorization';
import { PERMISSIONS } from '@/lib/permissions';
import { parsePagination } from '@/lib/api-input';
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
    const { page, limit, offset } = parsePagination(searchParams);

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
            .offset(offset)
        : baseQuery.limit(limit).offset(offset),
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
    const normalizedUsername =
      typeof username === 'string' ? username.trim() : '';
    const normalizedEmail =
      typeof email === 'string' ? email.trim().toLowerCase() : '';
    const normalizedRoleId = Number(roleId);

    // 验证必填字段
    if (
      !normalizedUsername ||
      !normalizedEmail ||
      typeof password !== 'string' ||
      !password ||
      !Number.isInteger(normalizedRoleId) ||
      normalizedRoleId <= 0
    ) {
      await logger.warn('创建用户', '创建用户失败：缺少必填字段', {
        missingFields: {
          username: !normalizedUsername,
          email: !normalizedEmail,
          password: !password,
          roleId: !Number.isInteger(normalizedRoleId) || normalizedRoleId <= 0
        },
        operatorId: currentUser?.id,
        operatorName: currentUser?.username
      });

      return errorResponse('请填写所有必填字段');
    }

    if (
      normalizedUsername.length > 50 ||
      normalizedEmail.length > 255 ||
      password.length < 8 ||
      password.length > 255 ||
      !['active', 'disabled'].includes(status)
    ) {
      return errorResponse('用户信息格式无效');
    }

    // 检查用户名或邮箱是否已存在
    const existingUser = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.username, normalizedUsername),
          eq(users.email, normalizedEmail)
        )
      )
      .limit(1);

    if (existingUser.length > 0) {
      await logger.warn('创建用户', '创建用户失败：用户名已存在', {
        username: normalizedUsername,
        email: normalizedEmail,
        operatorId: currentUser?.id,
        operatorName: currentUser?.username
      });

      return errorResponse('用户名或邮箱已存在');
    }

    const [targetRole] = await db
      .select({ id: roles.id })
      .from(roles)
      .where(eq(roles.id, normalizedRoleId))
      .limit(1);

    if (!targetRole) {
      return errorResponse('所选角色不存在');
    }

    // 加密密码
    const saltRounds = Number(process.env.SALT_ROUNDS || 12);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 创建用户
    await db.insert(users).values({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      roleId: normalizedRoleId,
      status,
      avatar: `/avatars/default.jpg`
    });

    // 记录成功日志
    await logger.info('创建用户', '用户创建成功', {
      username: normalizedUsername,
      email: normalizedEmail,
      roleId: normalizedRoleId,
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
