'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  LogItem,
  LogFilters,
  PaginationInfo,
  LogStats,
  LogDialogState
} from '../types';
import { DEFAULT_PAGINATION, MESSAGES } from '../constants';
import { LogAPI } from '@/service/request';

/**
 * 日志管理业务逻辑 Hook
 * 负责日志数据的查询和统计数据获取
 */
export function useLogManagement() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] =
    useState<PaginationInfo>(DEFAULT_PAGINATION);
  const [dialogState, setDialogState] = useState<LogDialogState>({
    type: null,
    log: null,
    open: false
  });

  /**
   * 获取日志列表
   */
  const fetchLogs = useCallback(async (filters: LogFilters) => {
    try {
      setLoading(true);

      // 构建查询参数
      const params: Record<string, any> = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (key === 'dateRange' && value) {
          // 处理日期范围
          const dateRange = value as { from: Date; to: Date };
          if (dateRange.from && dateRange.to) {
            const startDateStr = dateRange.from.toISOString().split('T')[0];
            const endDateStr = dateRange.to.toISOString().split('T')[0];
            params.startDate = startDateStr;
            params.endDate = endDateStr;
          }
        } else if (
          value !== undefined &&
          value !== null &&
          value !== '' &&
          (key !== 'level' || value !== 'all')
        ) {
          params[key] = value;
        }
      });

      const res = await LogAPI.getLogs(params);
      if (res.code === 0) {
        setLogs(res.data || []);
        setPagination({
          page: res.pager?.page || 1,
          limit: res.pager?.limit || 20,
          total: res.pager?.total || 0,
          totalPages: res.pager?.totalPages || 0
        });
      } else {
        toast.error(res.message || MESSAGES.ERROR.FETCH_LOGS);
        setLogs([]);
      }
    } catch (error) {
      console.error('获取日志列表失败:', error);
      toast.error(MESSAGES.ERROR.FETCH_LOGS);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 获取日志统计信息
   */
  const fetchLogStats = useCallback(async (): Promise<LogStats | null> => {
    try {
      const res = await LogAPI.getLogStats();
      if (res.code === 0) {
        const nextStats = res.data || null;
        setStats(nextStats);
        return nextStats;
      }

      toast.error(res.message || MESSAGES.ERROR.FETCH_STATS);
      setStats(null);
      return null;
    } catch (error) {
      console.error('获取统计信息失败:', error);
      toast.error(MESSAGES.ERROR.FETCH_STATS);
      setStats(null);
      return null;
    }
  }, []);

  /**
   * 刷新数据
   */
  const refreshLogs = useCallback(
    async (filters: LogFilters) => {
      await Promise.all([fetchLogs(filters), fetchLogStats()]);
      toast.success(MESSAGES.SUCCESS.REFRESH);
    },
    [fetchLogs, fetchLogStats]
  );

  /**
   * 打开日志详情对话框
   */
  const openDetailDialog = useCallback((log: LogItem) => {
    setDialogState({
      type: 'detail',
      log,
      open: true
    });
  }, []);

  /**
   * 关闭对话框
   */
  const closeDialog = useCallback(() => {
    setDialogState({
      type: null,
      log: null,
      open: false
    });
  }, []);

  return {
    // 状态
    logs,
    stats,
    loading,
    pagination,
    dialogState,

    // 方法
    fetchLogs,
    fetchLogStats,
    refreshLogs,
    openDetailDialog,
    closeDialog
  };
}
