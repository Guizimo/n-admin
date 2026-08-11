import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ManagementDialogHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export function ManagementDialogHeader({
  eyebrow,
  title,
  description,
  icon: Icon
}: ManagementDialogHeaderProps) {
  return (
    <DialogHeader className='border-border bg-card/60 shrink-0 border-b px-5 py-4 pr-16 text-left sm:px-6 sm:py-5 sm:pr-16'>
      <div className='flex items-start gap-3'>
        <div className='border-border bg-secondary flex size-9 shrink-0 items-center justify-center border text-[#32d6b4]'>
          <Icon className='size-4' aria-hidden='true' />
        </div>
        <div className='min-w-0'>
          <p className='text-[10px] font-semibold text-[#32d6b4] uppercase'>
            {eyebrow}
          </p>
          <DialogTitle className='mt-1 text-base leading-tight sm:text-lg'>
            {title}
          </DialogTitle>
          <DialogDescription className='mt-1 text-xs leading-5 sm:text-sm'>
            {description}
          </DialogDescription>
        </div>
      </div>
    </DialogHeader>
  );
}

interface ManagementFormFieldProps {
  htmlFor: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function ManagementFormField({
  htmlFor,
  label,
  required = false,
  error,
  children,
  className
}: ManagementFormFieldProps) {
  return (
    <div className={cn('grid min-w-0 gap-2', className)}>
      <Label htmlFor={htmlFor} className='text-foreground text-xs font-medium'>
        {label}
        {required && <span className='text-destructive'>*</span>}
      </Label>
      {children}
      {error && (
        <p className='text-destructive text-xs leading-4' role='alert'>
          {error}
        </p>
      )}
    </div>
  );
}

interface ManagementDialogFooterProps {
  children: ReactNode;
  className?: string;
}

export function ManagementDialogFooter({
  children,
  className
}: ManagementDialogFooterProps) {
  return (
    <DialogFooter
      className={cn(
        'border-border bg-card/40 shrink-0 border-t px-5 py-4 sm:px-6',
        className
      )}
    >
      <div className='flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
        {children}
      </div>
    </DialogFooter>
  );
}
