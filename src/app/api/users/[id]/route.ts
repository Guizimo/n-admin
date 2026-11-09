import { db } from '@/db';
import { roles, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import {
  preventSuperAdminModification,
  preventSuperAdminDisable
} from '@/lib/super-admin';
import { Logger } from '@/lib/logger';
import { authorizeApiRequest } from '@/lib/api-authorization';
import { PERMISSIONS } from '@/lib/permissions';
import {
  successResponse,
  errorResponse,
  notFoundResponse
} from '@/service/response';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authorization = await authorizeApiRequest(
    request,
    PERMISSIONS.USER.UPDATE
  );
  if (!authorization.authorized) return authorization.response;

  const currentUser = authorization.user;
  const logger = new Logger('用户管理', currentUser.id);

  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    if (!Number.isInteger(id) || id <= 0) {
      return errorResponse('用户 ID 无效');
    }

    // 获取原用户信息
    const originalUser = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!originalUser.length) {
      await logger.warn('更新用户', '更新用户失败：用户不存在', {
        targetUserId: id,
        operatorId: currentUser?.id,
        operatorName: currentUser?.username
      });
      return notFoundResponse('用户不存在');
    }

    const body = await request.json();
    const { username, email, password, roleId, status } = body;
    const normalizedRoleId = roleId === undefined ? undefined : Number(roleId);

    if (
      (username !== undefined &&
        (typeof username !== 'string' ||
          !username.trim() ||
          username.length > 50)) ||
      (email !== undefined &&
        (typeof email !== 'string' || !email.trim() || email.length > 255)) ||
      (password !== undefined &&
        (typeof password !== 'string' ||
          (password.length > 0 && password.length < 8) ||
          password.length > 255)) ||
      (status !== undefined && !['active', 'disabled'].includes(status)) ||
      (normalizedRoleId !== undefined &&
        (!Number.isInteger(normalizedRoleId) || normalizedRoleId <= 0))
    ) {
      return errorResponse('用户信息格式无效');
    }

    if (normalizedRoleId !== undefined) {
      const [targetRole] = await db
        .select({ id: roles.id })
        .from(roles)
        .where(eq(roles.id, normalizedRoleId))
        .limit(1);

      if (!targetRole) {
        return errorResponse('所选角色不存在');
      }
    }

    // 检查是否尝试禁用超级管理员
    if (status !== undefined) {
      await preventSuperAdminDisable(id, status);
    }

    // 对于其他修改，仍然保护超级管理员（但状态修改已经单独检查）
    if (
      username !== undefined ||
      email !== undefined ||
      password ||
      roleId !== undefined
    ) {
      await preventSuperAdminModification(id);
    }

    const updateData: Partial<typeof users.$inferInsert> = {};

    // 只更新提供的字段
    if (username !== undefined) updateData.username = username.trim();
    if (email !== undefined) updateData.email = email.trim().toLowerCase();
    if (normalizedRoleId !== undefined) updateData.roleId = normalizedRoleId;
    if (status !== undefined) updateData.status = status;

    // 只有在提供新密码时才更新密码
    if (password) {
      const saltRounds = Number(process.env.SALT_ROUNDS || 12);
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    await db.update(users).set(updateData).where(eq(users.id, id));

    // 记录更新日志
    await logger.info('更新用户', '用户信息更新成功', {
      targetUserId: id,
      targetUsername: originalUser[0].username,
      changedFields: {
        username:
          username !== undefined && originalUser[0].username !== username
            ? { from: originalUser[0].username, to: username }
            : undefined,
        email:
          email !== undefined && originalUser[0].email !== email
            ? { from: originalUser[0].email, to: email }
            : undefined,
        roleId:
          normalizedRoleId !== undefined &&
          originalUser[0].roleId !== normalizedRoleId
            ? { from: originalUser[0].roleId, to: normalizedRoleId }
            : undefined,
        status:
          status !== undefined && originalUser[0].status !== status
            ? { from: originalUser[0].status, to: status }
            : undefined,
        passwordChanged: !!password
      },
      operatorId: currentUser?.id,
      operatorName: currentUser?.username,
      timestamp: new Date().toISOString()
    });

    return successResponse({ message: '用户更新成功' });
  } catch (error) {
    await logger.error('更新用户', '更新用户失败：系统错误', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      operatorId: currentUser?.id,
      operatorName: currentUser?.username
    });

    return errorResponse((error as Error)?.message || '更新用户失败');
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authorization = await authorizeApiRequest(
    request,
    PERMISSIONS.USER.DELETE
  );
  if (!authorization.authorized) return authorization.response;

  const currentUser = authorization.user;
  const logger = new Logger('用户管理', currentUser.id);

  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    // 获取要删除的用户信息
    const targetUser = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!targetUser.length) {
      await logger.warn('删除用户', '删除用户失败：用户不存在', {
        targetUserId: id,
        operatorId: currentUser?.id,
        operatorName: currentUser?.username
      });
      return notFoundResponse('用户不存在');
    }

    await preventSuperAdminModification(id);
    await db.delete(users).where(eq(users.id, id));

    // 记录删除日志
    await logger.warn('删除用户', '用户删除成功', {
      deletedUserId: id,
      deletedUsername: targetUser[0].username,
      deletedEmail: targetUser[0].email,
      operatorId: currentUser?.id,
      operatorName: currentUser?.username,
      timestamp: new Date().toISOString()
    });

    return successResponse({ message: '用户删除成功' });
  } catch (error) {
    await logger.error('删除用户', '删除用户失败：系统错误', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      operatorId: currentUser?.id,
      operatorName: currentUser?.username
    });

    return errorResponse((error as Error)?.message || '删除用户失败');
  }
}
