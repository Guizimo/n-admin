'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { FileX, Database, Search, Users } from 'lucide-react';
import { TableSkeleton } from './table-skeleton';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: string;
  title: string;
  className?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  emptyState?: EmptyStateProps;
  rowKey?: string | ((record: T) => string);
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyText = '暂无数据',
  emptyState,
  rowKey = 'id'
}: DataTableProps<T>) {
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] || index.toString();
  };

  if (loading) {
    return (
      <TableSkeleton
        columnCount={columns.length}
        rowCount={8}
        showHeader={true}
      />
    );
  }

  return (
    <div className='bg-card relative h-full overflow-hidden rounded-lg border shadow-sm'>
      <div className='h-full overflow-auto'>
        <Table className='h-full min-w-[760px]'>
          <TableHeader className='bg-muted/60 sticky top-0 z-10'>
            <TableRow className='bg-muted/60 hover:bg-muted/60'>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    'bg-muted/60 h-11 px-4 text-xs font-semibold',
                    column.className
                  )}
                >
                  {column.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className='text-center'>
                  <div className='flex min-h-[200px] flex-col items-center justify-center space-y-4'>
                    <div className='bg-muted/50 rounded-full p-4'>
                      {emptyState?.icon || (
                        <Database className='text-muted-foreground h-8 w-8' />
                      )}
                    </div>
                    <div className='space-y-2 text-center'>
                      <p className='text-foreground text-sm font-medium'>
                        {emptyState?.title || emptyText || '暂无数据'}
                      </p>
                      <p className='text-muted-foreground max-w-sm text-xs'>
                        {emptyState?.description ||
                          '尝试调整筛选条件或添加新数据'}
                      </p>
                    </div>
                    {emptyState?.action && (
                      <div className='mt-4'>{emptyState.action}</div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((record, index) => (
                <TableRow
                  key={getRowKey(record, index)}
                  className='hover:bg-muted/40 h-13'
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn('px-4 py-3', column.className)}
                    >
                      {column.render
                        ? column.render(record[column.key], record, index)
                        : record[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
