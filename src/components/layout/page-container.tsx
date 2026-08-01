import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = true
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className='h-[calc(100dvh-3.5rem)]'>
          <div className='min-h-full bg-[#111416]'>
            <div className='mx-auto flex w-full max-w-[1600px] min-w-0 p-4 sm:p-5 lg:p-6'>
              {children}
            </div>
          </div>
        </ScrollArea>
      ) : (
        <div className='flex min-h-[calc(100dvh-3.5rem)] flex-1 bg-[#111416]'>
          <div className='mx-auto flex w-full max-w-[1600px] min-w-0 p-4 sm:p-5 lg:p-6'>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
