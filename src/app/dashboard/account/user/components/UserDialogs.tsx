import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { UserCog, UserRoundPlus } from 'lucide-react';
import { ManagementDialogHeader } from '@/components/shared/management-form';
import { UserForm } from './UserForm';
import { UserFormData, UserDialogState } from '../types';

interface UserDialogsProps {
  /** 对话框状态 */
  dialogState: UserDialogState;
  /** 关闭对话框回调 */
  onClose: () => void;
  /** 创建用户回调 */
  onCreateUser: (data: UserFormData) => Promise<void>;
  /** 更新用户回调 */
  onUpdateUser: (data: UserFormData) => Promise<void>;
}

/**
 * 用户对话框组件
 * 负责管理新增和编辑用户的对话框
 */
export function UserDialogs({
  dialogState,
  onClose,
  onCreateUser,
  onUpdateUser
}: UserDialogsProps) {
  const { type, user, open } = dialogState;

  /**
   * 处理表单提交
   */
  const handleSubmit = async (data: UserFormData) => {
    if (type === 'create') {
      await onCreateUser(data);
    } else if (type === 'edit' && user) {
      await onUpdateUser(data);
    }
  };

  /**
   * 获取对话框标题
   */
  const getDialogTitle = () => {
    switch (type) {
      case 'create':
        return '新增用户';
      case 'edit':
        return '编辑用户';
      default:
        return '';
    }
  };

  const isCreateMode = type === 'create';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='flex max-h-[calc(100vh-2rem)] w-[calc(100%-1rem)] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:w-full'>
        <ManagementDialogHeader
          eyebrow='Identity Control'
          title={getDialogTitle()}
          description={
            isCreateMode
              ? '建立账号并配置初始角色与访问状态'
              : '更新账号资料、角色与访问状态'
          }
          icon={isCreateMode ? UserRoundPlus : UserCog}
        />

        {open && (
          <UserForm
            initialData={type === 'edit' ? user || undefined : undefined}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
