import { db } from '@/db';
import { permissions } from '@/db/schema';
import { errorResponse, successResponse } from '@/service/response';
import { authorizeApiRequest } from '@/lib/api-authorization';
import { PERMISSIONS } from '@/lib/permissions';

export async function GET(request: Request) {
  const authorization = await authorizeApiRequest(
    request,
    PERMISSIONS.ROLE.ASSIGN
  );
  if (!authorization.authorized) return authorization.response;

  try {
    // 获取所有权限数据，按sortOrder排序
    const allPermissions = await db
      .select({
        id: permissions.id,
        name: permissions.name,
        code: permissions.code,
        description: permissions.description,
        parentId: permissions.parentId,
        sortOrder: permissions.sortOrder
      })
      .from(permissions)
      .orderBy(permissions.sortOrder);

    return successResponse(allPermissions);
  } catch (error) {
    console.error('获取权限列表失败:', error);
    return errorResponse('获取权限列表失败');
  }
}
