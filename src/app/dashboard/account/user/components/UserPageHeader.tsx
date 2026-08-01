import React from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/table/page-header';

interface UserPageHeaderProps {
  /** 新增用户回调 */
  onCreateUser: () => void;
}

/**
 * 用户页面头部组件
 * 负责页面标题和新增用户按钮
 */
export function UserPageHeader({ onCreateUser }: UserPageHeaderProps) {
  return (
    <PageHeader
      eyebrow='Identity Control'
      title='用户管理'
      description='管理系统用户账户和权限'
      action={{
        label: '新增用户',
        onClick: onCreateUser,
        icon: <Plus className='mr-2 h-4 w-4' />
      }}
    />
  );
}
