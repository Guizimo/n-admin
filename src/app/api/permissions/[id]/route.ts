import { db } from '@/db';
import { permissions } from '@/db/schema';
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

    await db
      .update(permissions)
      .set({ name, code, description })
      .where(eq(permissions.id, parseInt(id)));

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

    await db.delete(permissions).where(eq(permissions.id, parseInt(id)));

    return successResponse('权限删除成功');
  } catch (error) {
    return errorResponse('删除权限失败');
  }
}
