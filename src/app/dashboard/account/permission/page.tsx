'use client';

import React, { useEffect, useState } from 'react';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { PERMISSIONS } from '@/lib/permissions';
import { Pagination } from '@/components/table/pagination';
import PageContainer from '@/components/layout/page-container';

// 导入类型和常量
import type { PermissionFilters, PermissionFormData } from './types';
import { PAGE_SIZE_OPTIONS } from './constants';

// 导入自定义hooks
import { usePermissionFilters, usePermissionManagement } from './hooks';

// 导入组件
import {
  PermissionPageHeader,
  PermissionFilters as PermissionFiltersComponent,
  PermissionTable,
  PermissionDialogs
} from './components';

export default function PermissionManagementPage() {
  // 使用自定义 hooks
  const {
    filters,
    searchFilters,
    updatePagination,
    clearFilters,
    hasActiveFilters
  } = usePermissionFilters();
  const {
    permissions,
    loading,
    pagination,
    dialogState,
    fetchPermissions,
    createPermission,
    updatePermission,
    deletePermission,
    openCreateDialog,
    openEditDialog,
    closeDialog
  } = usePermissionManagement();

  // 监听 filters 变化，获取权限数据
  useEffect(() => {
    fetchPermissions(filters);
  }, [filters, fetchPermissions]);

  // 业务处理函数
  const handleSearch = (newFilters: Partial<PermissionFilters>) => {
    searchFilters(newFilters);
  };

  const handleReset = () => {
    clearFilters();
  };

  const handleFormSubmit = async (data: PermissionFormData) => {
    let success = false;

    if (dialogState.type === 'create') {
      success = await createPermission(data);
    } else if (dialogState.type === 'edit' && dialogState.permission) {
      success = await updatePermission(dialogState.permission.id, data);
    }

    if (success) {
      closeDialog();
      // 重新获取数据
      fetchPermissions(filters);
    }
  };

  const handleDeletePermission = async (permission: any) => {
    const success = await deletePermission(permission.id);
    if (success) {
      // 重新获取数据
      fetchPermissions(filters);
    }
  };

  return (
    <PermissionGuard permissions={PERMISSIONS.PERMISSION.READ}>
      <PageContainer scrollable={false}>
        <div className='flex min-h-0 w-full flex-1 flex-col gap-4'>
          {/* 页面头部 */}
          <PermissionPageHeader onCreatePermission={openCreateDialog} />

          {/* 搜索和筛选 */}
          <PermissionFiltersComponent
            filters={filters}
            onSearch={handleSearch}
            onReset={handleReset}
            loading={loading}
          />

          {/* 数据表格 */}
          <div className='flex min-h-0 flex-1 flex-col'>
            <PermissionTable
              permissions={permissions}
              loading={loading}
              pagination={pagination}
              onEdit={openEditDialog}
              onDelete={handleDeletePermission}
            />

            {/* 分页控件 */}
            <Pagination
              pagination={pagination}
              onPageChange={(page) => updatePagination(page)}
              onPageSizeChange={(limit) => updatePagination(1, limit)}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
          </div>

          {/* 对话框 */}
          <PermissionDialogs
            dialogState={dialogState}
            onClose={closeDialog}
            onSubmit={handleFormSubmit}
          />
        </div>
      </PageContainer>
    </PermissionGuard>
  );
}
