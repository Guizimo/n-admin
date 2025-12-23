'use client';
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Breadcrumbs } from './breadcrumbs';
import { ModeToggle } from './mode-toggle';
import SearchInput from './search-input';
import SearchButton from './search-button';

export default function Header() {
  return (
    <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 overflow-hidden border-b backdrop-blur md:rounded-t-xl'>
      <div className='flex h-16 shrink-0 items-center gap-2'>
        {/* 左侧：侧边栏触发器 + 面包屑 */}
        <div className='flex min-w-0 flex-1 items-center gap-2 px-3 sm:px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2 h-4' />
          <div className='min-w-0 flex-1'>
            <Breadcrumbs />
          </div>
        </div>

        {/* 右侧：搜索 + 主题切换 */}
        <div className='flex items-center gap-1 px-3 sm:gap-2 sm:px-4'>
          {/* 桌面端：完整搜索输入框 */}
          <div className='hidden md:flex'>
            <SearchInput />
          </div>

          {/* 移动端：搜索图标按钮 */}
          <div className='flex md:hidden'>
            <SearchButton />
          </div>

          {/* 主题切换按钮 */}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
