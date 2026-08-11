'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('relative w-fit p-3', className)}
      classNames={{
        months:
          'relative flex gap-4 [&>*:nth-child(2)]:hidden sm:[&>*:nth-child(2)]:flex',
        month: 'flex flex-col gap-4',
        month_caption: 'flex h-8 items-center justify-center px-8',
        caption_label: 'text-sm font-medium',
        nav: 'absolute inset-x-3 top-3 z-10 flex items-center justify-between',
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'size-8 rounded-none bg-transparent p-0 opacity-70 hover:opacity-100'
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'size-8 rounded-none bg-transparent p-0 opacity-70 hover:opacity-100'
        ),
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday:
          'text-muted-foreground flex size-8 items-center justify-center text-[0.75rem] font-normal',
        week: 'mt-1 flex w-full',
        day: 'relative size-8 p-0 text-center text-sm focus-within:z-20',
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-8 rounded-none p-0 font-normal aria-selected:opacity-100'
        ),
        range_start:
          'bg-primary text-primary-foreground [&>button]:bg-primary [&>button]:text-primary-foreground',
        range_end:
          'bg-primary text-primary-foreground [&>button]:bg-primary [&>button]:text-primary-foreground',
        range_middle:
          'bg-secondary text-secondary-foreground [&>button]:bg-transparent [&>button]:text-secondary-foreground',
        selected:
          'bg-primary text-primary-foreground [&>button]:bg-primary [&>button]:text-primary-foreground',
        today: 'border border-primary text-primary',
        outside: 'text-muted-foreground opacity-40',
        disabled: 'text-muted-foreground opacity-40',
        hidden: 'invisible',
        ...classNames
      }}
      components={{
        Chevron: ({ orientation, ...props }) => {
          const Icon = orientation === 'left' ? ChevronLeft : ChevronRight;
          return <Icon className={cn('size-4')} {...props} />;
        }
      }}
      {...props}
    />
  );
}

export { Calendar };
