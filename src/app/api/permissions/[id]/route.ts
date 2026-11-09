import { db } from '@/db';
import { permissions, rolePermissions } from '@/db/schema';
import { errorResponse, successResponse } from '@/service/response';
import { eq } from 'drizzle-orm';
import { authorizeApiRequest } from '@/lib/api-authorization';
import { PERMISSIONS } from '@/lib/permissions';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authorization = await authorizeApiRequest(
    request,
    PERMISSIONS.PERMISSION.UPDATE
  );
  if (!authorization.authorized) return authorization.response;

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, code, description } = body;
    const permissionId = parseInt(id);

    if (!Number.isInteger(permissionId) || permissionId <= 0) {
      return errorResponse('权限 ID 无效');
    }

    if (
      typeof name !== 'string' ||
      typeof code !== 'string' ||
      !name.trim() ||
      !code.trim() ||
      name.length > 50 ||
      code.length > 100 ||
      (description !== undefined &&
        (typeof description !== 'string' || description.length > 255))
    ) {
      return errorResponse('权限信息格式无效');
    }

    await db
      .update(permissions)
      .set({
        name: name.trim(),
        code: code.trim(),
        description: description?.trim() || null
      })
      .where(eq(permissions.id, permissionId));

    return successResponse('权限更新成功');
  } catch (error) {
    return errorResponse('更新权限失败');
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authorization = await authorizeApiRequest(
    request,
    PERMISSIONS.PERMISSION.DELETE
  );
  if (!authorization.authorized) return authorization.response;

  try {
    const { id } = await params;
    const permissionId = parseInt(id);

    if (!Number.isInteger(permissionId) || permissionId <= 0) {
      return errorResponse('权限 ID 无效');
    }

    await db.transaction(async (tx) => {
      await tx
        .delete(rolePermissions)
        .where(eq(rolePermissions.permissionId, permissionId));
      await tx.delete(permissions).where(eq(permissions.id, permissionId));
    });

    return successResponse('权限删除成功');
  } catch (error) {
    return errorResponse('删除权限失败');
  }
}
