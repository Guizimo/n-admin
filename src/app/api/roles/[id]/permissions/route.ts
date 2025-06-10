import { db } from '@/db';
import { rolePermissions, permissions, roles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { Logger } from '@/lib/logger';
import { getCurrentUser } from '@/lib/auth';

// 获取角色的权限列表
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const rolePermissionList = await db
      .select({
        id: permissions.id,
        name: permissions.name,
        code: permissions.code,
        description: permissions.description
      })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, parseInt(id)));

    return NextResponse.json(rolePermissionList);
  } catch (error) {
    console.error('获取角色权限失败:', error);
    return NextResponse.json({ error: '获取角色权限失败' }, { status: 500 });
  }
}

// 更新角色的权限
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const currentUser = getCurrentUser(request);
  const logger = new Logger('权限管理', currentUser?.id);

  try {
    const { id } = await params;
    const { permissionIds } = await request.json();
    const roleId = parseInt(id);

    // 获取角色信息
    const targetRole = await db
      .select()
      .from(roles)
      .where(eq(roles.id, roleId))
      .limit(1);

    if (!targetRole.length) {
      await logger.warn('分配权限', '权限分配失败：角色不存在', {
        targetRoleId: roleId,
        operatorId: currentUser?.id,
        operatorName: currentUser?.username
      });
      return NextResponse.json({ message: '角色不存在' }, { status: 404 });
    }

    // 获取原有权限用于对比
    const originalPermissions = await db
      .select({
        permissionId: rolePermissions.permissionId,
        permissionCode: permissions.code
      })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, roleId));

    const originalPermissionIds = originalPermissions.map(
      (p) => p.permissionId
    );

    // 获取新权限信息
    const newPermissions =
      permissionIds.length > 0
        ? await db
            .select({ id: permissions.id, code: permissions.code })
            .from(permissions)
            .where(eq(permissions.id, permissionIds[0])) // 这里简化处理，实际应该用IN查询
        : [];

    // 开启事务
    await db.transaction(async (tx) => {
      // 删除原有权限
      await tx
        .delete(rolePermissions)
        .where(eq(rolePermissions.roleId, roleId));

      // 添加新权限
      if (permissionIds.length > 0) {
        await tx.insert(rolePermissions).values(
          permissionIds.map((permissionId: number) => ({
            roleId,
            permissionId
          }))
        );
      }
    });

    // 记录权限分配日志
    await logger.info('分配权限', '角色权限分配成功', {
      targetRoleId: roleId,
      targetRoleName: targetRole[0].name,
      originalPermissions: originalPermissionIds,
      newPermissions: permissionIds,
      addedPermissions: permissionIds.filter(
        (id: number) => !originalPermissionIds.includes(id)
      ),
      removedPermissions: originalPermissionIds.filter(
        (id) => !permissionIds.includes(id)
      ),
      operatorId: currentUser?.id,
      operatorName: currentUser?.username,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ message: '权限更新成功' });
  } catch (error) {
    await logger.error('分配权限', '权限分配失败：系统错误', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      operatorId: currentUser?.id,
      operatorName: currentUser?.username
    });

    console.error('更新角色权限失败:', error);
    return NextResponse.json({ error: '更新角色权限失败' }, { status: 500 });
  }
}
