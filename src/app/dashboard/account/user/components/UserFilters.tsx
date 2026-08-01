'use client';

import React, { useState, useEffect } from 'react';
import { Search, Calendar, Filter, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { AdvancedFilterContainer } from '@/components/shared/advanced-filter-container';

import { UserFilters as UserFiltersType, Role } from '../types';
import { STATUS_OPTIONS } from '../constants';

interface UserFiltersProps {
  /** 筛选条件值 */
  filters: UserFiltersType;
  /** 角色选项 */
  roles: Role[];
  /** 查询回调 */
  onSearch: (filters: Partial<UserFiltersType>) => void;
  /** 重置回调 */
  onReset: () => void;
  /** 加载状态 */
  loading?: boolean;
}

/**
 * 用户筛选组件
 * 负责用户列表的搜索和筛选功能（手动查询模式）
 */
export function UserFilters({
  filters,
  roles,
  onSearch,
  onReset,
  loading = false
}: UserFiltersProps) {
  // 本地表单状态
  const [formData, setFormData] = useState<UserFiltersType>({
    username: '',
    email: '',
    roleId: '',
    status: 'all',
    dateRange: undefined,
    page: 1,
    limit: 10
  });

  // 控制高级筛选弹窗
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  // 同步外部 filters 到本地表单状态
  useEffect(() => {
    setFormData({
      username: filters.username || '',
      email: filters.email || '',
      roleId: filters.roleId || '',
      status: filters.status || 'all',
      dateRange: filters.dateRange,
      page: filters.page || 1,
      limit: filters.limit || 10
    });
  }, [filters]);

  /**
   * 更新表单字段值
   */
  const updateFormField = (key: keyof UserFiltersType, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  /**
   * 执行查询
   */
  const handleSearch = () => {
    onSearch({
      ...formData,
      page: 1 // 查询时重置到第一页
    });
  };

  /**
   * 重置筛选条件
   */
  const handleReset = () => {
    const resetData = {
      username: '',
      email: '',
      roleId: '',
      status: 'all' as const,
      dateRange: undefined,
      page: 1,
      limit: 10
    };
    setFormData(resetData);
    onReset();
  };

  /**
   * 回车键查询
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  /**
   * 检查是否有激活的筛选条件
   */
  const hasActiveFilters = Boolean(
    formData.username ||
      formData.email ||
      formData.roleId ||
      (formData.status && formData.status !== 'all') ||
      formData.dateRange
  );

  /**
   * 渲染快速搜索栏
   */
  const renderQuickSearch = () => (
    <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
      {/* 用户名搜索 */}
      <div className='relative w-full sm:max-w-sm sm:flex-1'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
        <Input
          placeholder='搜索用户名...'
          value={formData.username || ''}
          onChange={(e) => updateFormField('username', e.target.value)}
          onKeyDown={handleKeyPress}
          className='pl-10'
        />
      </div>

      {/* 查询按钮 */}
      <Button
        onClick={handleSearch}
        disabled={loading}
        className='w-full shrink-0 cursor-pointer sm:w-auto'
      >
        <Search className='mr-2 h-4 w-4' />
        查询
      </Button>

      {/* 高级筛选按钮 */}
      <Button
        variant='outline'
        onClick={() => setIsAdvancedFilterOpen(true)}
        className='w-full shrink-0 cursor-pointer sm:w-auto'
      >
        <Filter className='mr-2 h-4 w-4' />
        高级筛选
        {hasActiveFilters && (
          <span className='bg-primary ml-2 h-2 w-2 rounded-full' />
        )}
      </Button>

      {/* 重置按钮 */}
      {hasActiveFilters && (
        <Button
          variant='ghost'
          onClick={handleReset}
          className='text-muted-foreground hover:text-foreground w-full shrink-0 cursor-pointer sm:w-auto'
        >
          <RotateCcw className='mr-1 h-4 w-4' />
          重置
        </Button>
      )}
    </div>
  );

  /**
   * 渲染高级筛选表单内容
   */
  const renderAdvancedFilterForm = () => (
    <div className='grid gap-4'>
      {/* 第一行：用户名和邮箱 */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <Label>用户名</Label>
          <Input
            placeholder='请输入用户名'
            value={formData.username || ''}
            onChange={(e) => updateFormField('username', e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>
        <div className='space-y-2'>
          <Label>邮箱</Label>
          <Input
            placeholder='请输入邮箱'
            value={formData.email || ''}
            onChange={(e) => updateFormField('email', e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>
      </div>

      {/* 第二行：角色和状态 */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <Label>角色</Label>
          <Select
            value={formData.roleId || 'all'}
            onValueChange={(value) =>
              updateFormField('roleId', value === 'all' ? '' : value)
            }
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='选择角色' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>全部角色</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.id} value={String(role.id)}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-2'>
          <Label>状态</Label>
          <Select
            value={formData.status || 'all'}
            onValueChange={(value) => updateFormField('status', value)}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='选择状态' />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 第三行：创建时间范围 */}
      <div className='grid grid-cols-1 gap-4'>
        <div className='space-y-2'>
          <Label>创建时间</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !formData.dateRange && 'text-muted-foreground'
                )}
              >
                <Calendar className='mr-2 h-4 w-4' />
                {formData.dateRange &&
                formData.dateRange.from &&
                formData.dateRange.to
                  ? `${format(formData.dateRange.from, 'yyyy-MM-dd')} - ${format(formData.dateRange.to, 'yyyy-MM-dd')}`
                  : '选择时间范围'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <CalendarComponent
                mode='range'
                selected={formData.dateRange}
                onSelect={(dateRange) =>
                  updateFormField('dateRange', dateRange)
                }
                numberOfMonths={2}
                locale={zhCN}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );

  return (
    <div className='bg-background space-y-4 rounded-lg border p-3 shadow-sm'>
      {/* 快速搜索栏 */}
      {renderQuickSearch()}

      {/* 高级筛选弹窗 */}
      <AdvancedFilterContainer
        open={isAdvancedFilterOpen}
        onClose={() => setIsAdvancedFilterOpen(false)}
        title='用户筛选'
        hasActiveFilters={hasActiveFilters}
        onSearch={handleSearch}
        onReset={handleReset}
        loading={loading}
      >
        {renderAdvancedFilterForm()}
      </AdvancedFilterContainer>
    </div>
  );
}
