'use client';

import React from 'react';
import { Search, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerClose,
  DrawerTitle
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdvancedFilterContainerProps {
  /** 是否打开 */
  open: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 标题 */
  title?: string;
  /** 筛选表单内容 */
  children: React.ReactNode;
  /** 是否有激活的筛选条件 */
  hasActiveFilters?: boolean;
  /** 查询回调 */
  onSearch: () => void;
  /** 重置回调 */
  onReset: () => void;
  /** 加载状态 */
  loading?: boolean;
}

/**
 * 高级筛选容器组件
 * PC端使用Dialog，移动端使用Drawer
 */
export function AdvancedFilterContainer({
  open,
  onClose,
  title = '高级筛选',
  children,
  hasActiveFilters = false,
  onSearch,
  onReset,
  loading = false
}: AdvancedFilterContainerProps) {
  const isMobile = useIsMobile();

  /**
   * 执行搜索并关闭弹窗
   */
  const handleSearch = () => {
    onSearch();
    onClose();
  };

  /**
   * 执行重置
   */
  const handleReset = () => {
    onReset();
    // 重置后不自动关闭，让用户可以继续调整筛选条件
  };

  /**
   * 渲染操作按钮
   */
  const renderActions = () => (
    <div
      className={isMobile ? 'flex flex-col gap-2' : 'flex justify-end gap-3'}
    >
      <Button
        variant='outline'
        onClick={onClose}
        className={isMobile ? 'w-full' : ''}
      >
        取消
      </Button>
      <Button
        variant='outline'
        onClick={handleReset}
        disabled={!hasActiveFilters}
        className={isMobile ? 'w-full' : ''}
      >
        <RotateCcw className='mr-2 h-4 w-4' />
        重置
      </Button>
      <Button
        onClick={handleSearch}
        disabled={loading}
        className={isMobile ? 'w-full' : ''}
      >
        <Search className='mr-2 h-4 w-4' />
        {loading ? '查询中...' : '查询'}
      </Button>
    </div>
  );

  // 移动端使用 Drawer
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DrawerContent className='dashboard-shell dark border-border bg-background text-foreground max-h-[90vh] rounded-none'>
          <DrawerHeader className='border-border relative border-b px-5 py-4 text-left'>
            <div className='flex items-center gap-3 pr-10'>
              <div className='border-border bg-muted/30 text-primary flex size-9 shrink-0 items-center justify-center border'>
                <Search className='size-4' />
              </div>
              <div className='min-w-0'>
                <p className='text-primary text-[10px] font-semibold uppercase'>
                  Query Builder
                </p>
                <DrawerTitle className='text-lg'>{title}</DrawerTitle>
                <DrawerDescription className='sr-only'>
                  设置筛选条件
                </DrawerDescription>
              </div>
            </div>
            <DrawerClose asChild>
              <Button
                variant='ghost'
                size='sm'
                className='border-border absolute top-4 right-4 size-8 border p-0'
              >
                <X className='h-4 w-4' />
                <span className='sr-only'>关闭</span>
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <div className='flex-1 overflow-y-auto p-5'>{children}</div>

          <DrawerFooter className='border-border bg-muted/20 border-t p-4'>
            {renderActions()}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  // PC端使用 Dialog
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-2xl'>
        <DialogHeader className='border-border border-b px-5 py-4 text-left'>
          <div className='flex items-center gap-3 pr-10'>
            <div className='border-border bg-muted/30 text-primary flex size-9 shrink-0 items-center justify-center border'>
              <Search className='size-4' />
            </div>
            <div className='min-w-0'>
              <p className='text-primary text-[10px] font-semibold uppercase'>
                Query Builder
              </p>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription className='sr-only'>
                设置筛选条件
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className='flex-1 overflow-y-auto p-5'>{children}</div>

        <DialogFooter className='border-border bg-muted/20 border-t px-5 py-4'>
          {renderActions()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
