import { db } from '@/db';
import { roles } from '@/db/schema';
import { preventSuperRoleModification } from '@/lib/super-admin';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { Logger } from '@/lib/logger';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const currentUser = getCurrentUser(request);
  const logger = new Logger('角色管理', currentUser?.id);

  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    // 获取原角色信息
    const originalRole = await db
      .select()
      .from(roles)
      .where(eq(roles.id, id))
      .limit(1);

    if (!originalRole.length) {
      await logger.warn('更新角色', '更新角色失败：角色不存在', {
        targetRoleId: id,
        operatorId: currentUser?.id,
        operatorName: currentUser?.username
      });
      return NextResponse.json({ message: '角色不存在' }, { status: 404 });
    }

    await preventSuperRoleModification(id);
    const body = await request.json();
    const { name, description } = body;

    await db.update(roles).set({ name, description }).where(eq(roles.id, id));

    // 记录更新日志
    await logger.info('更新角色', '角色信息更新成功', {
      targetRoleId: id,
      targetRoleName: originalRole[0].name,
      changedFields: {
        name:
          originalRole[0].name !== name
            ? { from: originalRole[0].name, to: name }
            : undefined,
        description:
          originalRole[0].description !== description
            ? { from: originalRole[0].description, to: description }
            : undefined
      },
      operatorId: currentUser?.id,
      operatorName: currentUser?.username,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ message: '角色更新成功' });
  } catch (error) {
    await logger.error('更新角色', '更新角色失败：系统错误', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      operatorId: currentUser?.id,
      operatorName: currentUser?.username
    });

    return NextResponse.json(
      { error: (error as Error)?.message || '更新角色失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const currentUser = getCurrentUser(request);
  const logger = new Logger('角色管理', currentUser?.id);

  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    // 获取要删除的角色信息
    const targetRole = await db
      .select()
      .from(roles)
      .where(eq(roles.id, id))
      .limit(1);

    if (!targetRole.length) {
      await logger.warn('删除角色', '删除角色失败：角色不存在', {
        targetRoleId: id,
        operatorId: currentUser?.id,
        operatorName: currentUser?.username
      });
      return NextResponse.json({ message: '角色不存在' }, { status: 404 });
    }

    await preventSuperRoleModification(id);
    await db.delete(roles).where(eq(roles.id, id));

    // 记录删除日志
    await logger.warn('删除角色', '角色删除成功', {
      deletedRoleId: id,
      deletedRoleName: targetRole[0].name,
      deletedRoleDescription: targetRole[0].description,
      operatorId: currentUser?.id,
      operatorName: currentUser?.username,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ message: '角色删除成功' });
  } catch (error) {
    await logger.error('删除角色', '删除角色失败：系统错误', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      operatorId: currentUser?.id,
      operatorName: currentUser?.username
    });

    return NextResponse.json(
      { error: (error as Error)?.message || '删除角色失败' },
      { status: 500 }
    );
  }
}
