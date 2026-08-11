import { apiRequest, buildSearchParams } from './base';

// 日志相关 API
export class LogAPI {
  // 获取日志列表
  static async getLogs(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    level?: string;
  }) {
    const searchParams = buildSearchParams(params || {});
    return apiRequest(`/logs${searchParams ? `?${searchParams}` : ''}`);
  }

  static async getLogStats() {
    return apiRequest('/logs/stats');
  }
}
