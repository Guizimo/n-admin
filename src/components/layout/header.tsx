'use client';
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Breadcrumbs } from './breadcrumbs';
import SearchInput from './search-input';
import SearchButton from './search-button';
import { CircleDot } from 'lucide-react';

export default function Header() {
  return (
    <header className='bg-background/90 supports-[backdrop-filter]:bg-background/75 sticky top-0 z-30 overflow-hidden border-b backdrop-blur-xl'>
      <div className='flex h-14 shrink-0 items-center gap-2'>
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

          <div className='hidden items-center gap-2 border-l pl-3 text-xs text-white/45 lg:flex'>
            <CircleDot className='size-3.5 text-[#32d6b4]' />
            系统在线
          </div>
        </div>
      </div>
    </header>
  );
}
