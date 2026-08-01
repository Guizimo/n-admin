'use client';

import Image from 'next/image';
import * as React from 'react';
import { LifeBuoy, Send } from 'lucide-react';

import { NavMainWithPermission } from '@/components/layout/nav-main-with-permission';
import { NavSecondary } from '@/components/layout/nav-secondary';
import { NavUser } from '@/components/layout/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { siteConfig } from '@/config/site';

const data = {
  navSecondary: [
    {
      title: '支持',
      url: 'https://github.com/guizimo',
      icon: LifeBuoy
    },
    {
      title: '反馈',
      url: 'https://github.com/guizimo/n-admin/issues',
      icon: Send
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant='sidebar' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <a href='/dashboard/overview'>
                <div className='flex size-8 items-center justify-center border border-white/15 bg-white/5'>
                  <Image
                    src='/logo.png'
                    alt='Logo'
                    width={22}
                    height={22}
                    className='invert'
                  />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold text-white'>
                    {siteConfig.name}
                  </span>
                  <span className='truncate text-[10px] tracking-[0.14em] text-[#32d6b4] uppercase'>
                    AI Operations
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMainWithPermission />
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
