'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ManagementDialogFooter,
  ManagementFormField
} from '@/components/shared/management-form';
import { Save, ShieldPlus, X } from 'lucide-react';
import { useState } from 'react';
import { Permission, PermissionFormData } from '../types';

interface PermissionFormProps {
  /** 初始数据（编辑时） */
  initialData?: Permission;
  /** 提交回调 */
  onSubmit: (values: PermissionFormData) => void | Promise<void>;
  /** 取消回调 */
  onCancel?: () => void;
}

/**
 * 权限表单组件
 * 用于创建和编辑权限
 */
export function PermissionForm({
  initialData,
  onSubmit,
  onCancel
}: PermissionFormProps) {
  const [formData, setFormData] = useState<PermissionFormData>({
    name: initialData?.name || '',
    code: initialData?.code || '',
    description: initialData?.description || ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  const isEditing = Boolean(initialData);

  return (
    <form onSubmit={handleSubmit} className='flex min-h-0 flex-1 flex-col'>
      <div className='grid min-h-0 gap-4 overflow-y-auto px-5 py-5 sm:px-6'>
        <ManagementFormField htmlFor='name' label='权限名称' required>
          <Input
            id='name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='请输入权限名称'
            maxLength={50}
            className='h-10 bg-black/20'
            required
          />
        </ManagementFormField>
        <ManagementFormField htmlFor='code' label='权限标识' required>
          <Input
            id='code'
            name='code'
            value={formData.code}
            onChange={handleChange}
            placeholder='例如 account.user.create'
            maxLength={100}
            spellCheck={false}
            autoCapitalize='none'
            className='h-10 bg-black/20 font-mono'
            required
          />
        </ManagementFormField>
        <ManagementFormField htmlFor='description' label='审计描述'>
          <Textarea
            id='description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            placeholder='说明该权限允许执行的操作'
            maxLength={255}
            className='min-h-24 resize-none bg-black/20'
          />
        </ManagementFormField>
      </div>
      <ManagementDialogFooter>
        {onCancel && (
          <Button
            type='button'
            variant='outline'
            className='h-10 w-full cursor-pointer sm:w-auto sm:min-w-24'
            onClick={onCancel}
            disabled={submitting}
          >
            <X className='size-4' aria-hidden='true' />
            取消
          </Button>
        )}
        <Button
          type='submit'
          className='h-10 w-full cursor-pointer sm:w-auto sm:min-w-28'
          disabled={submitting}
        >
          {isEditing ? (
            <Save className='size-4' aria-hidden='true' />
          ) : (
            <ShieldPlus className='size-4' aria-hidden='true' />
          )}
          {submitting ? '处理中...' : isEditing ? '保存更改' : '创建权限'}
        </Button>
      </ManagementDialogFooter>
    </form>
  );
}
