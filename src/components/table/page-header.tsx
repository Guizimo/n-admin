'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  eyebrow,
  description,
  action,
  children
}: PageHeaderProps) {
  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
      <div className='min-w-0'>
        {eyebrow && (
          <p className='mb-2 text-[10px] font-semibold tracking-[0.18em] text-[#32d6b4] uppercase'>
            {eyebrow}
          </p>
        )}
        <h1 className='text-2xl font-semibold break-words'>{title}</h1>
        {description && (
          <p className='text-muted-foreground mt-1 text-sm'>{description}</p>
        )}
      </div>
      {action && (
        <Button
          onClick={action.onClick}
          className='w-full cursor-pointer sm:w-auto'
        >
          {action.icon || <Plus className='mr-2 h-4 w-4' />}
          {action.label}
        </Button>
      )}
      {children}
    </div>
  );
}
