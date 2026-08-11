'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ManagementDialogFooter,
  ManagementFormField
} from '@/components/shared/management-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Save, UserRoundPlus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { Role, User, UserFormData } from '../types';

interface UserFormProps {
  initialData?: User;
  onSubmit: (values: UserFormData) => void | Promise<void>;
  onCancel?: () => void;
}

export function UserForm({ initialData, onSubmit, onCancel }: UserFormProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    username: initialData?.username || '',
    email: initialData?.email || '',
    password: '',
    roleId: initialData?.roleId ? String(initialData.roleId) : '',
    status: initialData?.status || 'active'
  });

  useEffect(() => {
    // 获取角色列表
    const fetchRoles = async () => {
      try {
        const response = await fetch('/api/roles/label');
        const res = await response.json();
        if (!response.ok || res.code !== 0) {
          throw new Error(res.message || '获取角色列表失败');
        }
        setRoles(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        toast.error('获取角色列表失败');
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      roleId: value
    });
  };

  const handleStatusChange = (checked: boolean) => {
    setFormData({
      ...formData,
      status: checked ? 'disabled' : 'active'
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
    <form
      onSubmit={handleSubmit}
      autoComplete='off'
      className='flex min-h-0 flex-1 flex-col'
    >
      <div className='grid min-h-0 gap-4 overflow-y-auto px-5 py-5 sm:grid-cols-2 sm:px-6'>
        <ManagementFormField htmlFor='username' label='用户名' required>
          <Input
            id='username'
            name='username'
            value={formData.username}
            onChange={handleChange}
            placeholder='请输入用户名'
            autoComplete='off'
            maxLength={50}
            className='h-10 bg-black/20'
            required
          />
        </ManagementFormField>
        <ManagementFormField htmlFor='email' label='邮箱' required>
          <Input
            id='email'
            name='email'
            type='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='请输入邮箱'
            autoComplete='off'
            maxLength={255}
            className='h-10 bg-black/20'
            required
          />
        </ManagementFormField>
        <ManagementFormField
          htmlFor='password'
          label={isEditing ? '重置密码' : '初始密码'}
          required={!isEditing}
        >
          <Input
            id='password'
            name='password'
            type='password'
            value={formData.password}
            onChange={handleChange}
            placeholder={isEditing ? '留空则保持当前密码' : '请输入初始密码'}
            autoComplete='new-password'
            maxLength={255}
            className='h-10 bg-black/20'
            required={!initialData}
          />
        </ManagementFormField>
        <ManagementFormField htmlFor='role' label='角色' required>
          <Select
            onValueChange={handleRoleChange}
            value={formData.roleId}
            required
            disabled={initialData?.isSuperAdmin}
          >
            <SelectTrigger id='role' className='h-10 w-full bg-black/20'>
              <SelectValue placeholder='请选择角色' />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={String(role.id)}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ManagementFormField>
        <div className='grid gap-2 sm:col-span-2'>
          <Label htmlFor='status' className='text-xs font-medium'>
            访问状态
          </Label>
          <div className='border-border bg-secondary/30 flex items-start gap-3 border p-3'>
            <Checkbox
              id='status'
              className='mt-0.5'
              checked={formData.status === 'disabled'}
              onCheckedChange={handleStatusChange}
              disabled={initialData?.isSuperAdmin}
            />
            <Label
              htmlFor='status'
              className={`min-w-0 flex-1 cursor-pointer flex-col items-start gap-1 text-sm leading-5 font-medium ${
                initialData?.isSuperAdmin ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              <span>禁用此用户</span>
              <span className='text-muted-foreground text-xs font-normal'>
                禁用后该账号将无法登录管理工作台
              </span>
              {initialData?.isSuperAdmin && (
                <span className='text-xs font-normal text-[#f2c94c]'>
                  超级管理员的访问状态受系统保护
                </span>
              )}
            </Label>
          </div>
        </div>
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
            <UserRoundPlus className='size-4' aria-hidden='true' />
          )}
          {submitting ? '处理中...' : isEditing ? '保存更改' : '创建用户'}
        </Button>
      </ManagementDialogFooter>
    </form>
  );
}
