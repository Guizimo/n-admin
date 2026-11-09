import { db } from '@/db';
import { permissions } from '@/db/schema';
import { like, and, gte, lte, count } from 'drizzle-orm';
import { authorizeApiRequest } from '@/lib/api-authorization';
import { PERMISSIONS } from '@/lib/permissions';
import { parsePagination } from '@/lib/api-input';
import { successResponse, errorResponse } from '@/service/response';

export async function GET(request: Request) {
  const authorization = await authorizeApiRequest(
    request,
    PERMISSIONS.PERMISSION.READ
  );
  if (!authorization.authorized) return authorization.response;

  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const code = searchParams.get('code');
    const description = searchParams.get('description');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const { page, limit, offset } = parsePagination(searchParams);

    // 构建查询条件
    const conditions = [];

    if (name) {
      conditions.push(like(permissions.name, `%${name}%`));
    }

    if (code) {
      conditions.push(like(permissions.code, `%${code}%`));
    }

    if (description) {
      conditions.push(like(permissions.description, `%${description}%`));
    }

    if (startDate) {
      conditions.push(gte(permissions.createdAt, new Date(startDate)));
    }

    if (endDate) {
      conditions.push(lte(permissions.createdAt, new Date(endDate)));
    }

    // 构建基础查询
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 获取总数
    const [totalResult] = await db
      .select({ count: count() })
      .from(permissions)
      .where(whereClause);

    const total = totalResult.count;

    // 获取分页数据
    const baseQuery = db
      .select({
        id: permissions.id,
        name: permissions.name,
        code: permissions.code,
        description: permissions.description,
        parentId: permissions.parentId,
        sortOrder: permissions.sortOrder,
        createdAt: permissions.createdAt,
        updatedAt: permissions.updatedAt
      })
      .from(permissions);

    const query = whereClause ? baseQuery.where(whereClause) : baseQuery;

    const permissionList = await query
      .limit(limit)
      .offset(offset)
      .orderBy(permissions.createdAt);

    // 计算分页信息
    const totalPages = Math.ceil(total / limit);

    return successResponse(permissionList, {
      page,
      limit,
      total,
      totalPages
    });
  } catch (error) {
    console.error('获取权限列表失败:', error);
    return errorResponse('获取权限列表失败');
  }
}

export async function POST(request: Request) {
  const authorization = await authorizeApiRequest(
    request,
    PERMISSIONS.PERMISSION.CREATE
  );
  if (!authorization.authorized) return authorization.response;

  try {
    const body = await request.json();
    const { name, code, description } = body;

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

    await db.insert(permissions).values({
      name: name.trim(),
      code: code.trim(),
      description: description?.trim() || null
    });

    return successResponse({ message: '权限创建成功' });
  } catch (error) {
    console.error('创建权限失败:', error);
    return errorResponse('创建权限失败');
  }
}
