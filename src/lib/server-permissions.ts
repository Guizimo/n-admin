import { auth } from './auth';
import { db } from '@/db';
import { rolePermissions, permissions, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * 从请求中获取用户ID (服务端专用)
 */
export async function getUserFromRequest(): Promise<number | null> {
  try {
    const session = await auth();
    return session?.user.id || null;
  } catch {
    return null;
  }
}

/**
 * 获取用户的所有权限代码 (服务端专用)
 */
export async function getUserPermissions(userId?: number): Promise<string[]> {
  try {
    // 如果没有传入userId，尝试从请求中获取
    if (!userId) {
      const requestUserId = await getUserFromRequest();
      if (!requestUserId) {
        return [];
      }
      userId = requestUserId;
    }

    // 获取用户信息
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      return [];
    }

    const userInfo = user[0];

    if (userInfo.status !== 'active') {
      return [];
    }

    // 如果是超级管理员，返回所有权限
    if (userInfo.isSuperAdmin) {
      const allPermissions = await db.select().from(permissions);
      return allPermissions.map((p) => p.code);
    }

    // 获取角色权限
    const userPermissions = await db
      .select({
        code: permissions.code
      })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, userInfo.roleId));

    return userPermissions.map((p) => p.code);
  } catch (error) {
    console.error('获取用户权限失败:', error);
    return [];
  }
}

/**
 * 检查用户是否具有指定权限 (服务端专用)
 */
export async function hasPermission(
  permissionCode: string,
  userId?: number
): Promise<boolean> {
  try {
    const userPermissions = await getUserPermissions(userId);
    return userPermissions.includes(permissionCode);
  } catch (error) {
    console.error('权限检查失败:', error);
    return false;
  }
}

/**
 * 检查用户是否具有任意一个权限 (服务端专用)
 */
export async function hasAnyPermission(
  permissionCodes: string[],
  userId?: number
): Promise<boolean> {
  try {
    const userPermissions = await getUserPermissions(userId);
    return permissionCodes.some((code) => userPermissions.includes(code));
  } catch (error) {
    console.error('权限检查失败:', error);
    return false;
  }
}

/**
 * 检查用户是否具有所有权限 (服务端专用)
 */
export async function hasAllPermissions(
  permissionCodes: string[],
  userId?: number
): Promise<boolean> {
  try {
    const userPermissions = await getUserPermissions(userId);
    return permissionCodes.every((code) => userPermissions.includes(code));
  } catch (error) {
    console.error('权限检查失败:', error);
    return false;
  }
}
