'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ManagementFormField } from '@/components/shared/management-form';
import type { RoleFormData } from '../types';

interface RoleFormProps {
  data: RoleFormData;
  onChange: (data: RoleFormData) => void;
  errors?: Partial<Record<keyof RoleFormData, string>>;
}

export function RoleForm({ data, onChange, errors = {} }: RoleFormProps) {
  const handleChange = (field: keyof RoleFormData, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className='grid gap-4'>
      <ManagementFormField
        htmlFor='name'
        label='角色名称'
        required
        error={errors.name}
      >
        <Input
          id='name'
          placeholder='请输入角色名称'
          value={data.name}
          onChange={(e) => handleChange('name', e.target.value)}
          maxLength={50}
          aria-invalid={Boolean(errors.name)}
          className='h-10 bg-black/20'
        />
      </ManagementFormField>

      <ManagementFormField
        htmlFor='description'
        label='角色说明'
        error={errors.description}
      >
        <Textarea
          id='description'
          placeholder='请输入角色描述'
          value={data.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          maxLength={255}
          aria-invalid={Boolean(errors.description)}
          className='min-h-24 resize-none bg-black/20'
        />
      </ManagementFormField>
    </div>
  );
}
