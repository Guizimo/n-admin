'use client';

import React, { useEffect } from 'react';

import { PermissionGuard } from '@/components/auth/permission-guard';
import { PERMISSIONS } from '@/lib/permissions';
import { Pagination } from '@/components/table/pagination';
import PageContainer from '@/components/layout/page-container';

import {
  LogFilters,
  LogTable,
  LogPageHeader,
  LogDetailDialog
} from './components';
import { useLogFilters, useLogManagement } from './hooks';
import { PAGE_SIZE_OPTIONS } from './constants';

export default function LogsPage() {
  // 使用自定义hooks
  const {
    filters,
    searchFilters,
    updatePagination,
    clearFilters,
    hasActiveFilters
  } = useLogFilters();

  const {
    logs,
    loading,
    pagination,
    dialogState,
    fetchLogs,
    refreshLogs,
    openDetailDialog,
    closeDialog
  } = useLogManagement();

  // 初始化和筛选条件变化时获取数据
  useEffect(() => {
    fetchLogs(filters);
  }, [filters, fetchLogs]);

  // 处理查询
  const handleSearch = (newFilters: any) => {
    searchFilters(newFilters);
  };

  // 处理重置
  const handleReset = () => {
    clearFilters();
  };

  // 处理分页变化
  const handlePageChange = (page: number) => {
    updatePagination({ page });
  };

  // 处理页面大小变化
  const handlePageSizeChange = (limit: number) => {
    updatePagination({ limit, page: 1 });
  };

  // 处理刷新
  const handleRefresh = () => {
    refreshLogs(filters);
  };

  return (
    <PermissionGuard permissions={PERMISSIONS.LOG.READ}>
      <PageContainer scrollable={false}>
        <div className='flex min-h-0 w-full flex-1 flex-col gap-4'>
          {/* 页面头部 */}
          <LogPageHeader
            filters={filters}
            onRefresh={handleRefresh}
            loading={loading}
          />

          {/* 搜索和筛选 */}
          <LogFilters
            filters={filters}
            onSearch={handleSearch}
            onReset={handleReset}
            loading={loading}
          />

          {/* 数据表格 */}
          <div className='flex min-h-0 flex-1 flex-col'>
            <LogTable
              data={logs}
              loading={loading}
              pagination={pagination}
              onView={openDetailDialog}
            />

            {/* 分页控件 */}
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
          </div>

          {/* 日志详情弹窗 */}
          <LogDetailDialog
            log={dialogState.log}
            open={dialogState.open}
            onOpenChange={(open) => {
              if (!open) {
                closeDialog();
              }
            }}
          />
        </div>
      </PageContainer>
    </PermissionGuard>
  );
}
