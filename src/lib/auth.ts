import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { getJwtSecret } from '@/lib/jwt';

export interface User {
  id: number;
  email: string;
  username: string;
  avatar: string;
  roleId: string;
}

export interface Session {
  user: User;
}

/**
 * 服务端认证函数 - 只能在服务端组件中使用
 */
export async function auth(): Promise<Session | null> {
  const cookieStore = cookies();
  const token = (await cookieStore).get('token');

  if (!token) {
    return null;
  }

  try {
    const verified = verify(token.value, getJwtSecret()) as User;
    return {
      user: {
        id: verified.id,
        email: verified.email,
        username: verified.username,
        avatar: verified.avatar,
        roleId: verified.roleId
      }
    };
  } catch {
    return null;
  }
}

/**
 * 验证token的工具函数 - 可以在任何地方使用
 */
export function verifyToken(token: string): User | null {
  try {
    const verified = verify(token, getJwtSecret()) as User;
    return {
      id: verified.id,
      email: verified.email,
      username: verified.username,
      avatar: verified.avatar,
      roleId: verified.roleId
    };
  } catch {
    return null;
  }
}

/**
 * 从Request中获取当前用户信息 - 用于API routes
 */
export function getCurrentUser(request: Request): User | null {
  try {
    const token = request.headers.get('cookie')?.match(/token=([^;]+)/)?.[1];
    if (!token) {
      return null;
    }
    return verifyToken(token);
  } catch {
    return null;
  }
}
