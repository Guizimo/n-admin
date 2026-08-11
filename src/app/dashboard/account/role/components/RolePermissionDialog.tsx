'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Shield, CheckCircle2, Settings, X } from 'lucide-react';
import { ManagementDialogHeader } from '@/components/shared/management-form';
import {
  PermissionTree,
  type Permission as TreePermission
} from '@/components/shared/permission-tree';
import type { PermissionDialogState } from '../types';
import { MESSAGES } from '../constants';

interface RolePermissionDialogProps {
  dialogState: PermissionDialogState;
  onClose: () => void;
  onPermissionsChange: (permissionIds: number[]) => void;
  onSave: () => Promise<boolean>;
  loading?: boolean;
}

export function RolePermissionDialog({
  dialogState,
  onClose,
  onPermissionsChange,
  onSave,
  loading = false
}: RolePermissionDialogProps) {
  // 现在selectedIds已经包含了所有应该被计算的权限（包括半选状态的父权限）
  const selectedCount = dialogState.selectedPermissions.length;

  const handlePermissionChange = (newIds: number[]) => {
    onPermissionsChange(newIds);
  };

  const handleSave = async () => {
    const success = await onSave();
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={dialogState.open} onOpenChange={onClose}>
      <DialogContent className='flex max-h-[calc(100vh-2rem)] w-[calc(100%-1rem)] max-w-[calc(100%-1rem)] flex-col gap-0 overflow-hidden p-0 sm:max-h-[82vh] sm:w-full sm:max-w-4xl'>
        <ManagementDialogHeader
          eyebrow='Access Matrix'
          title='权限分配'
          description={`为角色“${dialogState.role?.name || '未命名角色'}”配置最小权限集合`}
          icon={Settings}
        />

        <div className='flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-4 py-4 sm:px-6'>
          <div className='bg-secondary/40 flex items-start gap-2 border-l-2 border-[#f2c94c] px-3 py-2.5'>
            <Shield className='mt-0.5 size-4 shrink-0 text-[#f2c94c]' />
            <p className='text-muted-foreground text-xs leading-5 sm:text-sm'>
              父权限与子权限保持联动，保存前请复核最终选择范围
            </p>
          </div>

          <div className='border-border min-h-0 flex-1 overflow-hidden border bg-black/20'>
            <div className='h-full overflow-y-auto p-3 sm:p-4'>
              {dialogState.permissions.length > 0 ? (
                <PermissionTree
                  permissions={dialogState.permissions as TreePermission[]}
                  selectedIds={dialogState.selectedPermissions}
                  onSelectionChange={handlePermissionChange}
                  disabled={loading}
                />
              ) : (
                <div className='flex flex-col items-center justify-center py-12 text-center'>
                  <Shield className='text-muted-foreground mb-3 h-12 w-12' />
                  <p className='text-muted-foreground'>
                    {MESSAGES.EMPTY.PERMISSIONS}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className='border-border bg-card/40 shrink-0 border-t px-4 py-4 sm:px-6'>
          <div className='flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-2'>
              {selectedCount > 0 ? (
                <>
                  <CheckCircle2 className='size-4 text-[#32d6b4]' />
                  <span className='text-muted-foreground text-sm'>已选择</span>
                  <Badge
                    variant='secondary'
                    className='border border-[#32d6b4]/30 bg-[#32d6b4]/10 text-[#32d6b4]'
                  >
                    {selectedCount} 个权限
                  </Badge>
                </>
              ) : (
                <>
                  <Shield className='text-muted-foreground size-4' />
                  <span className='text-muted-foreground text-sm'>
                    未选择权限
                  </span>
                </>
              )}
            </div>
            <div className='grid grid-cols-2 gap-2 sm:flex'>
              <Button
                variant='outline'
                onClick={onClose}
                disabled={loading}
                className='h-10 cursor-pointer sm:min-w-24'
              >
                <X className='size-4' aria-hidden='true' />
                取消
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
                className='h-10 cursor-pointer sm:min-w-28'
              >
                {loading ? (
                  '保存中...'
                ) : (
                  <>
                    <CheckCircle2 className='size-4' />
                    保存权限
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
