'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 筛选字段类型定义
export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterField {
  key: string;
  type: 'text' | 'select' | 'dateRange';
  label: string;
  placeholder?: string;
  options?: FilterOption[]; // 用于 select 类型
  width?: string; // 自定义宽度
}

interface SearchFilterProps {
  fields: FilterField[];
  values: Record<string, any>;
  onValuesChange: (values: Record<string, any>) => void;
  debounceDelay?: number;
}

export function SearchFilter({
  fields,
  values,
  onValuesChange,
  debounceDelay = 500
}: SearchFilterProps) {
  // 每个字段单独管理状态和防抖
  const [textInputs, setTextInputs] = useState<Record<string, string>>(() =>
    fields.reduce(
      (acc, field) => {
        if (field.type === 'text') {
          acc[field.key] = values[field.key] || '';
        }

        return acc;
      },
      {} as Record<string, string>
    )
  );
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    const pendingTimeouts = timeoutRefs.current;

    return () => {
      Object.values(pendingTimeouts).forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  const handleTextChange = useCallback(
    (key: string, value: string) => {
      // 更新本地状态
      setTextInputs((prev) => ({ ...prev, [key]: value }));

      // 清除之前的定时器
      if (timeoutRefs.current[key]) {
        clearTimeout(timeoutRefs.current[key]);
      }

      // 设置新的防抖定时器
      timeoutRefs.current[key] = setTimeout(() => {
        onValuesChange({ ...values, [key]: value });
      }, debounceDelay);
    },
    [values, onValuesChange, debounceDelay]
  );

  const handleSelectChange = useCallback(
    (key: string, value: string) => {
      const newValue = value === 'all' ? '' : value;
      onValuesChange({ ...values, [key]: newValue });
    },
    [values, onValuesChange]
  );

  const handleDateRangeChange = useCallback(
    (key: string, dateRange: any) => {
      const newValues = { ...values, [key]: dateRange };
      onValuesChange(newValues);
    },
    [values, onValuesChange]
  );

  const clearFilters = useCallback(() => {
    const clearedValues = fields.reduce(
      (acc, field) => {
        if (field.type === 'dateRange') {
          acc[field.key] = undefined;
        } else {
          acc[field.key] = '';
        }
        return acc;
      },
      {} as Record<string, any>
    );

    // 清空文本输入状态
    const clearedTextInputs: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.type === 'text') {
        clearedTextInputs[field.key] = '';
      }
    });
    setTextInputs(clearedTextInputs);

    // 清除所有防抖定时器
    Object.values(timeoutRefs.current).forEach((timeout) => {
      if (timeout) clearTimeout(timeout);
    });
    timeoutRefs.current = {};

    onValuesChange(clearedValues);
  }, [fields, onValuesChange]);

  const hasActiveFilters = Object.values(values).some(
    (value) =>
      value && value !== '' && !(Array.isArray(value) && value.length === 0)
  );

  const renderField = (field: FilterField) => {
    switch (field.type) {
      case 'text':
        return (
          <div key={field.key} className='relative'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
            <Input
              placeholder={field.placeholder || `搜索${field.label}...`}
              className={`pl-10 ${field.width || 'w-80'}`}
              value={textInputs[field.key] || ''}
              onChange={(e) => handleTextChange(field.key, e.target.value)}
            />
          </div>
        );

      case 'select':
        const selectValue = values[field.key] || '';
        return (
          <div key={field.key} className='flex items-center gap-2'>
            <span className='text-muted-foreground text-sm font-medium whitespace-nowrap'>
              {field.label}
            </span>
            <Select
              value={selectValue || 'all'}
              onValueChange={(value) => handleSelectChange(field.key, value)}
            >
              <SelectTrigger className={field.width || 'w-40'}>
                <SelectValue
                  placeholder={field.placeholder || `全部${field.label}`}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>
                  {field.placeholder || `全部${field.label}`}
                </SelectItem>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'dateRange':
        const dateValue = values[field.key];
        return (
          <div key={field.key} className='flex items-center gap-2'>
            <span className='text-muted-foreground text-sm font-medium whitespace-nowrap'>
              {field.label}
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={`justify-start text-left font-normal ${field.width || 'w-60'}`}
                >
                  <Calendar className='mr-2 h-4 w-4' />
                  {dateValue && dateValue.from && dateValue.to
                    ? `${format(dateValue.from, 'yyyy-MM-dd', { locale: zhCN })} - ${format(dateValue.to, 'yyyy-MM-dd', { locale: zhCN })}`
                    : field.placeholder || '选择日期范围'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <CalendarComponent
                  mode='range'
                  selected={dateValue}
                  onSelect={(dateRange) =>
                    handleDateRangeChange(field.key, dateRange)
                  }
                  numberOfMonths={2}
                  locale={zhCN}
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex flex-wrap items-center gap-4'>
        {fields.map(renderField)}

        {hasActiveFilters && (
          <Button variant='outline' onClick={clearFilters}>
            <X className='mr-1 h-4 w-4' />
            清空筛选
          </Button>
        )}
      </div>
    </div>
  );
}
