import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';
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

async function resolveActiveUser(token: string): Promise<User | null> {
  const verified = verifyToken(token);
  if (!verified) return null;

  const [currentUser] = await db
    .select({
      id: users.id,
      email: users.email,
      username: users.username,
      avatar: users.avatar,
      roleId: users.roleId,
      status: users.status
    })
    .from(users)
    .where(eq(users.id, verified.id))
    .limit(1);

  if (!currentUser || currentUser.status !== 'active') {
    return null;
  }

  return {
    id: currentUser.id,
    email: currentUser.email,
    username: currentUser.username,
    avatar: currentUser.avatar || '/avatars/default.jpg',
    roleId: String(currentUser.roleId)
  };
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
    const user = await resolveActiveUser(token.value);
    return user ? { user } : null;
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
export async function getCurrentUser(request: Request): Promise<User | null> {
  try {
    const token = request.headers.get('cookie')?.match(/token=([^;]+)/)?.[1];
    if (!token) {
      return null;
    }
    return await resolveActiveUser(token);
  } catch {
    return null;
  }
}
