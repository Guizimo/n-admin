'use client';

import React, { useState, useEffect } from 'react';
import { Search, Calendar, Filter, X, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

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
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';

import type { RoleFilters } from '../types';
import { ROLE_STATUS_OPTIONS } from '../constants';

interface RoleFiltersProps {
  /** 筛选条件值 */
  filters: RoleFilters;
  /** 查询回调 */
  onSearch: (filters: Partial<RoleFilters>) => void;
  /** 重置回调 */
  onReset: () => void;
  /** 加载状态 */
  loading?: boolean;
}

/**
 * 角色筛选组件
 * 负责角色列表的搜索和筛选功能（手动查询模式）
 */
export function RoleFilters({
  filters,
  onSearch,
  onReset,
  loading = false
}: RoleFiltersProps) {
  // 本地表单状态
  const [formData, setFormData] = useState<RoleFilters>({
    name: '',
    description: '',
    status: 'all',
    dateRange: undefined,
    page: 1,
    limit: 10
  });

  // 展开/收起筛选面板
  const [isExpanded, setIsExpanded] = useState(false);

  // 同步外部 filters 到本地表单状态
  useEffect(() => {
    setFormData({
      name: filters.name || '',
      description: filters.description || '',
      status: filters.status || 'all',
      dateRange: filters.dateRange,
      page: filters.page || 1,
      limit: filters.limit || 10
    });
  }, [filters]);

  /**
   * 更新表单字段值
   */
  const updateFormField = (key: keyof RoleFilters, value: any) => {
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
      name: '',
      description: '',
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
    formData.name ||
      formData.description ||
      (formData.status && formData.status !== 'all') ||
      formData.dateRange
  );

  /**
   * 渲染快速搜索栏
   */
  const renderQuickSearch = () => (
    <div className='flex items-center gap-3'>
      {/* 角色名称搜索 */}
      <div className='relative max-w-sm flex-1'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
        <Input
          placeholder='搜索角色名称...'
          value={formData.name || ''}
          onChange={(e) => updateFormField('name', e.target.value)}
          onKeyDown={handleKeyPress}
          className='pl-10'
        />
      </div>

      {/* 查询按钮 */}
      <Button
        onClick={handleSearch}
        disabled={loading}
        className='shrink-0 cursor-pointer'
      >
        <Search className='mr-2 h-4 w-4' />
        查询
      </Button>

      {/* 高级筛选切换 */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant='outline' className='shrink-0 cursor-pointer'>
            <Filter className='mr-2 h-4 w-4' />
            高级筛选
            {hasActiveFilters && (
              <span className='bg-primary ml-2 h-2 w-2 rounded-full' />
            )}
          </Button>
        </CollapsibleTrigger>
      </Collapsible>

      {/* 重置按钮 */}
      {hasActiveFilters && (
        <Button
          variant='ghost'
          onClick={handleReset}
          className='text-muted-foreground hover:text-foreground shrink-0 cursor-pointer'
        >
          <RotateCcw className='mr-1 h-4 w-4' />
          重置
        </Button>
      )}
    </div>
  );

  /**
   * 渲染高级筛选面板
   */
  const renderAdvancedFilters = () => (
    <Card className='border-dashed'>
      <CardContent className=''>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4'>
          {/* 角色名称 */}
          <div className='space-y-1.5'>
            <Label
              htmlFor='name'
              className='text-muted-foreground text-xs font-medium'
            >
              角色名称
            </Label>
            <Input
              id='name'
              placeholder='请输入角色名称'
              value={formData.name || ''}
              onChange={(e) => updateFormField('name', e.target.value)}
              onKeyDown={handleKeyPress}
              className='h-9 w-full'
            />
          </div>

          {/* 角色描述 */}
          <div className='space-y-1.5'>
            <Label
              htmlFor='description'
              className='text-muted-foreground text-xs font-medium'
            >
              角色描述
            </Label>
            <Input
              id='description'
              placeholder='请输入角色描述'
              value={formData.description || ''}
              onChange={(e) => updateFormField('description', e.target.value)}
              onKeyDown={handleKeyPress}
              className='h-9 w-full'
            />
          </div>

          {/* 角色类型 */}
          <div className='space-y-1.5'>
            <Label className='text-muted-foreground text-xs font-medium'>
              角色类型
            </Label>
            <Select
              value={formData.status || 'all'}
              onValueChange={(value) => updateFormField('status', value)}
            >
              <SelectTrigger className='h-9 w-full cursor-pointer'>
                <SelectValue placeholder='请选择角色类型' />
              </SelectTrigger>
              <SelectContent>
                {ROLE_STATUS_OPTIONS.map((status) => (
                  <SelectItem
                    key={status.value}
                    value={status.value}
                    className='cursor-pointer'
                  >
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 创建时间 */}
          <div className='space-y-1.5'>
            <Label className='text-muted-foreground text-xs font-medium'>
              创建时间
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className='h-9 w-full cursor-pointer justify-start px-3 text-left font-normal'
                >
                  <Calendar className='mr-2 h-3 w-3 flex-shrink-0' />
                  <span className='truncate'>
                    {formData.dateRange &&
                    formData.dateRange.from &&
                    formData.dateRange.to
                      ? `${format(formData.dateRange.from, 'MM/dd', { locale: zhCN })} - ${format(formData.dateRange.to, 'MM/dd', { locale: zhCN })}`
                      : '选择时间范围'}
                  </span>
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

        {/* 操作按钮 */}
        <div className='mt-4 flex items-center justify-end gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleReset}
            disabled={!hasActiveFilters}
            className='cursor-pointer'
          >
            <X className='mr-1 h-3 w-3' />
            重置
          </Button>
          <Button
            size='sm'
            onClick={handleSearch}
            disabled={loading}
            className='cursor-pointer'
          >
            <Search className='mr-1 h-3 w-3' />
            查询
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className='space-y-3'>
      {/* 快速搜索栏 */}
      {renderQuickSearch()}

      {/* 高级筛选面板 */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent>{renderAdvancedFilters()}</CollapsibleContent>
      </Collapsible>
    </div>
  );
}
