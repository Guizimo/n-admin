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

import type { LogFilters } from '../types';
import { LOG_LEVEL_OPTIONS } from '../constants';

interface LogFiltersProps {
  /** 筛选条件值 */
  filters: LogFilters;
  /** 查询回调 */
  onSearch: (filters: Partial<LogFilters>) => void;
  /** 重置回调 */
  onReset: () => void;
  /** 加载状态 */
  loading?: boolean;
}

/**
 * 日志筛选组件
 * 负责日志列表的搜索和筛选功能（手动查询模式）
 */
export function LogFilters({
  filters,
  onSearch,
  onReset,
  loading = false
}: LogFiltersProps) {
  // 本地表单状态
  const [formData, setFormData] = useState<LogFilters>({
    level: 'all',
    module: '',
    action: '',
    search: '',
    dateRange: undefined,
    page: 1,
    limit: 20
  });

  // 控制高级筛选弹窗
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  // 同步外部 filters 到本地表单状态
  useEffect(() => {
    setFormData({
      level: filters.level || 'all',
      module: filters.module || '',
      action: filters.action || '',
      search: filters.search || '',
      dateRange: filters.dateRange,
      page: filters.page || 1,
      limit: filters.limit || 20
    });
  }, [filters]);

  /**
   * 更新表单字段值
   */
  const updateFormField = (key: keyof LogFilters, value: any) => {
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
      level: 'all' as const,
      module: '',
      action: '',
      search: '',
      dateRange: undefined,
      page: 1,
      limit: 20
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
    formData.search ||
      formData.module ||
      formData.action ||
      (formData.level && formData.level !== 'all') ||
      formData.dateRange
  );

  /**
   * 渲染快速搜索栏
   */
  const renderQuickSearch = () => (
    <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
      {/* 日志消息搜索 */}
      <div className='relative w-full sm:max-w-sm sm:flex-1'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
        <Input
          placeholder='搜索日志消息...'
          value={formData.search || ''}
          onChange={(e) => updateFormField('search', e.target.value)}
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
      {/* 第一行：搜索内容和日志级别 */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <Label>搜索内容</Label>
          <Input
            placeholder='请输入搜索内容'
            value={formData.search || ''}
            onChange={(e) => updateFormField('search', e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>
        <div className='space-y-2'>
          <Label>日志级别</Label>
          <Select
            value={formData.level || 'all'}
            onValueChange={(value) => updateFormField('level', value)}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='选择日志级别' />
            </SelectTrigger>
            <SelectContent>
              {LOG_LEVEL_OPTIONS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 第二行：模块和操作 */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <Label>模块</Label>
          <Input
            placeholder='请输入模块名称'
            value={formData.module || ''}
            onChange={(e) => updateFormField('module', e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>
        <div className='space-y-2'>
          <Label>操作</Label>
          <Input
            placeholder='请输入操作名称'
            value={formData.action || ''}
            onChange={(e) => updateFormField('action', e.target.value)}
            onKeyDown={handleKeyPress}
          />
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
        title='日志筛选'
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
