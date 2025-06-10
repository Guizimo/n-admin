import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

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
    const verified = verify(
      token.value,
      process.env.JWT_SECRET || 'secret'
    ) as User;
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
    const verified = verify(token, process.env.JWT_SECRET || 'secret') as User;
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
