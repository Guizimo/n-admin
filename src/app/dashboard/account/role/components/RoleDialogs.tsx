'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { BadgeCheck, BadgePlus, Save, X } from 'lucide-react';
import {
  ManagementDialogFooter,
  ManagementDialogHeader
} from '@/components/shared/management-form';
import { RoleForm } from './RoleForm';
import type { RoleDialogState, RoleFormData } from '../types';

interface RoleDialogsProps {
  dialogState: RoleDialogState;
  onClose: () => void;
  onCreate: (data: RoleFormData) => Promise<boolean>;
  onUpdate: (id: number, data: RoleFormData) => Promise<boolean>;
  loading?: boolean;
}

export function RoleDialogs({
  dialogState,
  onClose,
  onCreate,
  onUpdate,
  loading = false
}: RoleDialogsProps) {
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: ''
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof RoleFormData, string>>
  >({});

  // 当对话框状态变化时重置表单
  useEffect(() => {
    if (dialogState.open) {
      if (dialogState.type === 'edit' && dialogState.role) {
        setFormData({
          name: dialogState.role.name,
          description: dialogState.role.description || ''
        });
      } else {
        setFormData({
          name: '',
          description: ''
        });
      }
      setErrors({});
    }
  }, [dialogState]);

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RoleFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入角色名称';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = '角色名称不能超过50个字符';
    }

    if (formData.description && formData.description.length > 255) {
      newErrors.description = '描述不能超过255个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交处理
  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!validateForm()) return;

    let success = false;

    if (dialogState.type === 'create') {
      success = await onCreate(formData);
    } else if (dialogState.type === 'edit' && dialogState.role) {
      success = await onUpdate(dialogState.role.id, formData);
    }

    if (success) {
      onClose();
    }
  };

  const isCreateMode = dialogState.type === 'create';
  const title = isCreateMode ? '新增角色' : '编辑角色';
  const submitText = isCreateMode ? '创建角色' : '保存更改';

  return (
    <Dialog open={dialogState.open} onOpenChange={onClose}>
      <DialogContent className='flex max-h-[calc(100vh-2rem)] w-[calc(100%-1rem)] max-w-lg flex-col gap-0 overflow-hidden p-0 sm:w-full'>
        <ManagementDialogHeader
          eyebrow='Access Control'
          title={title}
          description={
            isCreateMode
              ? '建立职责边界，后续可为角色分配最小权限'
              : '更新角色名称与职责说明'
          }
          icon={isCreateMode ? BadgePlus : BadgeCheck}
        />

        <form onSubmit={handleSubmit} className='flex min-h-0 flex-1 flex-col'>
          <div className='min-h-0 overflow-y-auto px-5 py-5 sm:px-6'>
            <RoleForm data={formData} onChange={setFormData} errors={errors} />
          </div>

          <ManagementDialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={loading}
              className='h-10 w-full cursor-pointer sm:w-auto sm:min-w-24'
            >
              <X className='size-4' aria-hidden='true' />
              取消
            </Button>
            <Button
              type='submit'
              disabled={loading}
              className='h-10 w-full cursor-pointer sm:w-auto sm:min-w-28'
            >
              {isCreateMode ? (
                <BadgePlus className='size-4' aria-hidden='true' />
              ) : (
                <Save className='size-4' aria-hidden='true' />
              )}
              {loading ? '处理中...' : submitText}
            </Button>
          </ManagementDialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
