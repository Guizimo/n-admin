'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/table/page-header';

import type { LogFilters } from '../types';

interface LogPageHeaderProps {
  /** 当前筛选条件 */
  filters: LogFilters;
  /** 刷新数据回调 */
  onRefresh: () => void;
  /** 加载状态 */
  loading?: boolean;
}

export function LogPageHeader({
  filters,
  onRefresh,
  loading = false
}: LogPageHeaderProps) {
  return (
    <PageHeader
      eyebrow='Audit Trail'
      title='日志管理'
      description='查看和管理系统运行日志'
      action={{
        label: '刷新数据',
        onClick: onRefresh,
        icon: <RefreshCw className='mr-2 h-4 w-4' />
      }}
    />
  );
}
