import { db } from '@/db';
import { roles } from '@/db/schema';
import { errorResponse, successResponse } from '@/service/response';
import { authorizeApiRequest } from '@/lib/api-authorization';
import { PERMISSIONS } from '@/lib/permissions';

export async function GET(request: Request) {
  const authorization = await authorizeApiRequest(
    request,
    PERMISSIONS.USER.READ
  );
  if (!authorization.authorized) return authorization.response;

  try {
    const roleList = await db
      .select({
        id: roles.id,
        name: roles.name
      })
      .from(roles);

    return successResponse(roleList);
  } catch (error) {
    console.error('获取角色标签失败:', error);
    return errorResponse('获取角色标签失败');
  }
}
