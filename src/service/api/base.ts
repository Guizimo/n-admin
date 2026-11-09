// API 基础 URL
export const API_BASE_URL = '/api';

// 通用请求函数
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        payload?.message || `请求失败，状态码：${response.status}`
      );
    }

    if (payload?.code !== undefined && payload.code !== 0) {
      throw new Error(payload.message || '请求失败');
    }

    return payload;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// 构建查询参数
export function buildSearchParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}
