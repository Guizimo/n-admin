'use client';

import React, { useEffect, useState } from 'react';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { PERMISSIONS } from '@/lib/permissions';
import { Pagination } from '@/components/table/pagination';
import PageContainer from '@/components/layout/page-container';
import { Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 导入重构后的组件和 hooks
import {
  UserTable,
  UserFilters,
  UserDialogs,
  UserPageHeader
} from './components';
import { useUserFilters, useUserManagement } from './hooks';
import { User, UserFormData, UserDialogState } from './types';
import { PAGE_SIZE_OPTIONS, DIALOG_TYPES } from './constants';

export default function UserManagementPage() {
  // 使用自定义 hooks
  const {
    filters,
    searchFilters,
    updatePagination,
    clearFilters,
    hasActiveFilters
  } = useUserFilters();
  const {
    users,
    roles,
    loading,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  } = useUserManagement();

  // 对话框状态
  const [dialogState, setDialogState] = useState<UserDialogState>({
    type: null,
    user: null,
    open: false
  });

  // 监听 filters 变化，获取用户数据
  useEffect(() => {
    fetchUsers(filters);
  }, [filters, fetchUsers]);

  /**
   * 打开创建用户对话框
   */
  const handleOpenCreateDialog = () => {
    setDialogState({
      type: DIALOG_TYPES.CREATE as any,
      user: null,
      open: true
    });
  };

  /**
   * 打开编辑用户对话框
   */
  const handleOpenEditDialog = (user: User) => {
    setDialogState({
      type: DIALOG_TYPES.EDIT as any,
      user,
      open: true
    });
  };

  /**
   * 关闭对话框
   */
  const handleCloseDialog = () => {
    setDialogState({
      type: null,
      user: null,
      open: false
    });
  };

  /**
   * 创建用户
   */
  const handleCreateUser = async (data: UserFormData) => {
    const success = await createUser(data);
    if (success) {
      handleCloseDialog();
      fetchUsers(filters);
    }
  };

  /**
   * 更新用户
   */
  const handleUpdateUser = async (data: UserFormData) => {
    if (!dialogState.user) return;

    const success = await updateUser(dialogState.user.id, data);
    if (success) {
      handleCloseDialog();
      fetchUsers(filters);
    }
  };

  /**
   * 删除用户
   */
  const handleDeleteUser = async (user: User) => {
    const success = await deleteUser(user.id);
    if (success) {
      fetchUsers(filters);
    }
  };

  /**
   * 启用用户
   */
  const handleEnableUser = async (user: User) => {
    const success = await updateUser(user.id, { status: 'active' });
    if (success) {
      fetchUsers(filters);
    }
  };

  /**
   * 禁用用户
   */
  const handleDisableUser = async (user: User) => {
    const success = await updateUser(user.id, { status: 'disabled' });
    if (success) {
      fetchUsers(filters);
    }
  };

  return (
    <PermissionGuard permissions={PERMISSIONS.USER.READ}>
      <PageContainer scrollable={false}>
        <div className='flex min-h-0 w-full flex-1 flex-col gap-4'>
          {/* 页面头部 */}
          <UserPageHeader onCreateUser={handleOpenCreateDialog} />

          {/* 搜索和筛选 */}
          <UserFilters
            filters={filters}
            roles={roles}
            onSearch={searchFilters}
            onReset={clearFilters}
            loading={loading}
          />

          {/* 数据表格和分页 */}
          <div className='flex min-h-0 flex-1 flex-col'>
            <div className='min-h-0'>
              <UserTable
                users={users}
                loading={loading}
                pagination={pagination}
                onEdit={handleOpenEditDialog}
                onDelete={handleDeleteUser}
                onEnable={handleEnableUser}
                onDisable={handleDisableUser}
                emptyState={{
                  icon: <Users className='text-muted-foreground h-8 w-8' />,
                  title: hasActiveFilters ? '未找到匹配的用户' : '还没有用户',
                  description: hasActiveFilters
                    ? '请尝试调整筛选条件以查看更多结果'
                    : '开始添加用户来管理您的系统',
                  action: !hasActiveFilters ? (
                    <PermissionGuard permissions={PERMISSIONS.USER.CREATE}>
                      <Button
                        onClick={handleOpenCreateDialog}
                        size='sm'
                        className='mt-2'
                      >
                        <Plus className='mr-2 h-4 w-4' />
                        添加用户
                      </Button>
                    </PermissionGuard>
                  ) : undefined
                }}
              />
            </div>

            {/* 分页控件 */}
            <div className='flex-shrink-0'>
              <Pagination
                pagination={pagination}
                onPageChange={(page) => updatePagination({ page })}
                onPageSizeChange={(limit) =>
                  updatePagination({ limit, page: 1 })
                }
                pageSizeOptions={PAGE_SIZE_OPTIONS}
              />
            </div>
          </div>

          {/* 用户对话框 */}
          <UserDialogs
            dialogState={dialogState}
            onClose={handleCloseDialog}
            onCreateUser={handleCreateUser}
            onUpdateUser={handleUpdateUser}
          />
        </div>
      </PageContainer>
    </PermissionGuard>
  );
}
