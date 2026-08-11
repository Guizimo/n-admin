'use client';

import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { KeyRound, ShieldPlus } from 'lucide-react';
import { ManagementDialogHeader } from '@/components/shared/management-form';
import { PermissionForm } from './PermissionForm';
import type { PermissionDialogState, PermissionFormData } from '../types';

interface PermissionDialogsProps {
  /** 对话框状态 */
  dialogState: PermissionDialogState;
  /** 关闭对话框回调 */
  onClose: () => void;
  /** 提交表单回调 */
  onSubmit: (data: PermissionFormData) => Promise<void>;
}

/**
 * 权限对话框组件
 * 包含创建和编辑权限的对话框
 */
export function PermissionDialogs({
  dialogState,
  onClose,
  onSubmit
}: PermissionDialogsProps) {
  const { type, permission, open } = dialogState;

  const handleSubmit = async (data: PermissionFormData) => {
    await onSubmit(data);
  };

  const getDialogTitle = () => {
    switch (type) {
      case 'create':
        return '新增权限';
      case 'edit':
        return '编辑权限';
      default:
        return '';
    }
  };

  const isCreateMode = type === 'create';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='flex max-h-[calc(100vh-2rem)] w-[calc(100%-1rem)] max-w-lg flex-col gap-0 overflow-hidden p-0 sm:w-full'>
        <ManagementDialogHeader
          eyebrow='Policy Control'
          title={getDialogTitle()}
          description={
            isCreateMode
              ? '定义可分配给角色的最小访问能力'
              : '更新权限名称、标识与审计说明'
          }
          icon={isCreateMode ? ShieldPlus : KeyRound}
        />
        <PermissionForm
          initialData={permission || undefined}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
