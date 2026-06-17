import { successResponse } from '@/service/response';
import { logger } from '@/lib/logger';
import { verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // 获取token并解析用户信息
    const token = request.headers.get('cookie')?.match(/token=([^;]+)/)?.[1];
    let userId: number | undefined;
    let username: string | undefined;

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        userId = decoded.id;
        username = decoded.username;
      }
    }

    // 记录登出日志
    await logger.info('用户认证', '用户登出', '用户退出系统', {
      userId,
      username,
      logoutTime: new Date().toISOString(),
      hasValidToken: !!token
    });

    return successResponse('退出成功');
  } catch (error) {
    // 记录登出错误日志
    await logger.error('用户认证', '用户登出', '登出过程发生错误', {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    });
    return successResponse('退出成功');
  }
}
