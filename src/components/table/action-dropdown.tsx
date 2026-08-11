'use client';

import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

export interface ActionItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export interface DeleteAction {
  title?: string;
  description: string;
  onConfirm: () => void;
}

interface ActionDropdownProps {
  actions: ActionItem[];
  deleteAction?: DeleteAction;
  triggerClassName?: string;
}

export function ActionDropdown({
  actions,
  deleteAction,
  triggerClassName = 'h-8 w-8 p-0 cursor-pointer'
}: ActionDropdownProps) {
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className={triggerClassName}>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {actions.map((action) => (
            <DropdownMenuItem
              key={action.key}
              onClick={action.onClick}
              className={cn('cursor-pointer', action.className)}
              disabled={action.disabled}
            >
              {action.label}
            </DropdownMenuItem>
          ))}

          {deleteAction && (
            <DropdownMenuItem
              onSelect={() => setDeleteOpen(true)}
              className='cursor-pointer'
              variant='destructive'
            >
              删除
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {deleteAction && (
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {deleteAction.title || '确认删除'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {deleteAction.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className='cursor-pointer'>
                取消
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteAction.onConfirm}
                className='bg-destructive hover:bg-destructive/90 cursor-pointer text-white'
              >
                删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
