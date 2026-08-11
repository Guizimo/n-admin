import type { NextResponse } from 'next/server';
import { getCurrentUser, type User } from '@/lib/auth';
import { hasPermission } from '@/lib/server-permissions';
import { forbiddenResponse, unauthorizedResponse } from '@/service/response';

type PermissionChecker = (
  permissionCode: string,
  userId: number
) => Promise<boolean>;

export type AuthorizationResult =
  | { authorized: true; user: User }
  | { authorized: false; response: NextResponse };

export async function authorizeApiRequest(
  request: Request,
  permissionCode?: string,
  permissionChecker: PermissionChecker = hasPermission
): Promise<AuthorizationResult> {
  const user = getCurrentUser(request);

  if (!user) {
    return {
      authorized: false,
      response: unauthorizedResponse('请先登录')
    };
  }

  if (permissionCode && !(await permissionChecker(permissionCode, user.id))) {
    return {
      authorized: false,
      response: forbiddenResponse('无权执行此操作')
    };
  }

  return { authorized: true, user };
}
