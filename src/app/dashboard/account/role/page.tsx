'use client';

import React, { useEffect, useState } from 'react';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { PERMISSIONS } from '@/lib/permissions';
import { Pagination } from '@/components/custom-table';
import PageContainer from '@/components/layout/page-container';

import {
  RoleTable,
  RoleFilters,
  RoleDialogs,
  RolePermissionDialog,
  RolePageHeader
} from './components';

import { useRoleFilters, useRoleManagement } from './hooks';
import { DEFAULT_PAGINATION, PAGE_SIZE_OPTIONS } from './constants';
import type { Role } from './types';

export default function RoleManagementPage() {
  const [filters, setFilters] = useState(
    useRoleFilters().parseFiltersFromUrl()
  );

  const { updatePagination, searchFilters, parseFiltersFromUrl } =
    useRoleFilters();

  const {
    roles,
    loading,
    pagination,
    dialogState,
    permissionDialogState,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    assignPermissions,
    openCreateDialog,
    openEditDialog,
    openPermissionDialog,
    closeDialog,
    closePermissionDialog,
    setPermissionDialogState
  } = useRoleManagement();

  // 同步URL参数到状态
  useEffect(() => {
    setFilters(parseFiltersFromUrl());
  }, [parseFiltersFromUrl]);

  // 获取数据
  useEffect(() => {
    fetchRoles(filters);
  }, [fetchRoles, filters]);

  // 处理搜索
  const handleSearch = (newFilters: Partial<typeof filters>) => {
    searchFilters(newFilters);
  };

  // 处理重置
  const handleReset = () => {
    searchFilters({
      name: '',
      description: '',
      status: 'all',
      dateRange: undefined,
      page: 1,
      limit: 10
    });
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    updatePagination(page);
  };

  const handlePageSizeChange = (limit: number) => {
    updatePagination(1, limit);
  };

  // 处理删除
  const handleDelete = async (role: Role) => {
    const success = await deleteRole(role.id);
    if (success) {
      await fetchRoles(filters);
    }
  };

  // 处理创建
  const handleCreate = async (data: any) => {
    const success = await createRole(data);
    if (success) {
      await fetchRoles(filters);
    }
    return success;
  };

  // 处理更新
  const handleUpdate = async (id: number, data: any) => {
    const success = await updateRole(id, data);
    if (success) {
      await fetchRoles(filters);
    }
    return success;
  };

  // 处理权限分配
  const handlePermissionSave = async (): Promise<boolean> => {
    if (!permissionDialogState.role) return false;

    const success = await assignPermissions(
      permissionDialogState.role.id,
      permissionDialogState.selectedPermissions
    );

    if (success) {
      await fetchRoles(filters);
    }

    return success;
  };

  // 更新权限选择
  const handlePermissionsChange = (permissionIds: number[]) => {
    setPermissionDialogState({
      ...permissionDialogState,
      selectedPermissions: permissionIds
    });
  };

  return (
    <PermissionGuard permissions={PERMISSIONS.ROLE.READ}>
      <PageContainer scrollable={false}>
        <div className='flex h-[calc(100vh-8rem)] w-full flex-col space-y-4'>
          {/* 页面头部 */}
          <RolePageHeader onCreateRole={openCreateDialog} />

          {/* 搜索和筛选 */}
          <RoleFilters
            filters={filters}
            onSearch={handleSearch}
            onReset={handleReset}
            loading={loading}
          />

          {/* 数据表格 */}
          <div className='flex min-h-0 flex-col'>
            <RoleTable
              data={roles}
              loading={loading}
              onEdit={openEditDialog}
              onPermission={openPermissionDialog}
              onDelete={handleDelete}
            />

            {/* 分页控件 */}
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
          </div>

          {/* 创建/编辑对话框 */}
          <RoleDialogs
            dialogState={dialogState}
            onClose={closeDialog}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            loading={loading}
          />

          {/* 权限分配对话框 */}
          <RolePermissionDialog
            dialogState={permissionDialogState}
            onClose={closePermissionDialog}
            onPermissionsChange={handlePermissionsChange}
            onSave={handlePermissionSave}
            loading={loading}
          />
        </div>
      </PageContainer>
    </PermissionGuard>
  );
}
