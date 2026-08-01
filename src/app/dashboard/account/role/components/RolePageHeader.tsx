'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/table/page-header';

interface RolePageHeaderProps {
  onCreateRole: () => void;
}

export function RolePageHeader({ onCreateRole }: RolePageHeaderProps) {
  return (
    <PageHeader
      eyebrow='Access Control'
      title='角色管理'
      description='管理系统角色和权限'
      action={{
        label: '新增角色',
        onClick: onCreateRole,
        icon: <Plus className='mr-2 h-4 w-4' />
      }}
    />
  );
}
