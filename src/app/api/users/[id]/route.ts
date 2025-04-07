import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { username, email, password, role } = body;

    const updateData: any = {
      username,
      email,
      role
    };

    // 只有在提供新密码时才更新密码
    if (password) {
      const saltRounds = Number(process.env.SALT_ROUNDS || 12);
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, parseInt(id)));

    return NextResponse.json({ message: '用户更新成功' });
  } catch (error) {
    return NextResponse.json({ error: '更新用户失败' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    console.log(id);
    await db
      .delete(users)
      .where(eq(users.id, parseInt(id)));

    return NextResponse.json({ message: '用户删除成功' });
  } catch (error) {
    return NextResponse.json({ error: '删除用户失败' }, { status: 500 });
  }
}