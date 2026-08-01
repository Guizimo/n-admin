'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
}

export function Pagination({
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 50, 100],
  showPageSizeSelector = true
}: PaginationProps) {
  const { page, limit, total, totalPages } = pagination;

  return (
    <div className='bg-background mt-3 rounded-lg border px-3 py-3 shadow-sm sm:px-4'>
      {/* 移动端布局 */}
      <div className='flex flex-col gap-4 sm:hidden'>
        {/* 分页按钮居中 */}
        <div className='flex items-center justify-center'>
          <div className='flex items-center gap-1'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onPageChange(1)}
              disabled={page <= 1}
              className='h-9 w-9 cursor-pointer p-0'
              aria-label='第一页'
            >
              <ChevronsLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className='h-9 w-9 cursor-pointer p-0'
              aria-label='上一页'
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <span className='mx-3 text-sm font-medium'>
              {page} / {totalPages}
            </span>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className='h-9 w-9 cursor-pointer p-0'
              aria-label='下一页'
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onPageChange(totalPages)}
              disabled={page >= totalPages}
              className='h-9 w-9 cursor-pointer p-0'
              aria-label='最后一页'
            >
              <ChevronsRight className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* 信息行：总记录数和每页显示 */}
        <div className='text-muted-foreground flex items-center justify-between text-sm'>
          <span>共 {total} 条</span>
          {showPageSizeSelector && (
            <div className='flex items-center gap-1'>
              <span>每页</span>
              <Select
                value={String(limit)}
                onValueChange={(value) => onPageSizeChange(parseInt(value))}
              >
                <SelectTrigger className='h-8 w-[80px] cursor-pointer text-xs'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((pageSize) => (
                    <SelectItem
                      key={pageSize}
                      value={String(pageSize)}
                      className='cursor-pointer text-xs'
                    >
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>条</span>
            </div>
          )}
        </div>
      </div>

      {/* PC端布局 */}
      <div className='hidden items-center justify-between sm:flex'>
        <div className='text-muted-foreground text-sm'>总计 {total} 条记录</div>
        <div className='flex items-center gap-6'>
          {showPageSizeSelector && (
            <div className='flex items-center gap-2'>
              <span className='text-muted-foreground text-sm'>每页显示</span>
              <Select
                value={String(limit)}
                onValueChange={(value) => onPageSizeChange(parseInt(value))}
              >
                <SelectTrigger className='h-8 w-[80px] cursor-pointer'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((pageSize) => (
                    <SelectItem
                      key={pageSize}
                      value={String(pageSize)}
                      className='cursor-pointer'
                    >
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className='text-muted-foreground text-sm'>条</span>
            </div>
          )}
          <div className='flex items-center gap-4'>
            <span className='text-muted-foreground text-sm'>
              第 {page} 页，共 {totalPages} 页
            </span>
            <div className='flex items-center gap-1'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onPageChange(1)}
                disabled={page <= 1}
                className='h-8 w-8 cursor-pointer p-0'
                aria-label='第一页'
              >
                <ChevronsLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className='h-8 w-8 cursor-pointer p-0'
                aria-label='上一页'
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className='h-8 w-8 cursor-pointer p-0'
                aria-label='下一页'
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onPageChange(totalPages)}
                disabled={page >= totalPages}
                className='h-8 w-8 cursor-pointer p-0'
                aria-label='最后一页'
              >
                <ChevronsRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
