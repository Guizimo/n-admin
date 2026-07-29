'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthAPI } from '@/service/request';
import { useAuthStore } from '@/stores/auth';
import { resetGlobalInitFlag } from '@/hooks/use-auth';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const router = useRouter();
  const { forceReInitialize } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: process.env.NODE_ENV === 'development' ? 'admin@example.com' : '',
    password: process.env.NODE_ENV === 'development' ? 'Admin@123456' : ''
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await AuthAPI.login(formData);

      if (response.code !== 0) {
        toast.error(response.message || '登录失败');
        return;
      }

      toast.success('登录成功');
      resetGlobalInitFlag();
      await forceReInitialize();
      router.replace('/dashboard');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('w-full', className)} {...props}>
      <form onSubmit={handleSubmit} aria-busy={loading}>
        <div className='space-y-5'>
          <div className='space-y-2'>
            <Label
              htmlFor='email'
              className='text-xs font-medium text-black/65'
            >
              邮箱
            </Label>
            <div className='relative'>
              <Mail className='pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-black/30' />
              <Input
                id='email'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='name@company.com'
                autoComplete='email'
                inputMode='email'
                required
                disabled={loading}
                className='h-12 rounded-[4px] border-black/15 bg-white/75 pr-4 pl-10 text-sm text-[#171a1b] shadow-none placeholder:text-black/25 focus-visible:border-[#007d6e] focus-visible:ring-[#007d6e]/15'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='password'
              className='text-xs font-medium text-black/65'
            >
              密码
            </Label>
            <div className='relative'>
              <LockKeyhole className='pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-black/30' />
              <Input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                autoComplete='current-password'
                required
                disabled={loading}
                className='h-12 rounded-[4px] border-black/15 bg-white/75 pr-11 pl-10 text-sm text-[#171a1b] shadow-none focus-visible:border-[#007d6e] focus-visible:ring-[#007d6e]/15'
              />
              <button
                type='button'
                onClick={() => setShowPassword((visible) => !visible)}
                disabled={loading}
                className='absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-black/35 transition-colors hover:text-black disabled:pointer-events-none disabled:opacity-40'
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <EyeOff className='h-4 w-4' />
                ) : (
                  <Eye className='h-4 w-4' />
                )}
              </button>
            </div>
          </div>
        </div>

        <Button
          type='submit'
          disabled={loading}
          className='mt-7 h-12 w-full rounded-[4px] bg-[#171a1b] text-sm font-medium text-white shadow-none transition-transform hover:-translate-y-0.5 hover:bg-black'
        >
          {loading ? (
            <>
              <LoaderCircle className='h-4 w-4 animate-spin' />
              正在验证
            </>
          ) : (
            <>
              进入工作台
              <ArrowRight className='h-4 w-4' />
            </>
          )}
        </Button>

        {process.env.NODE_ENV === 'development' && (
          <div className='mt-4 flex items-center justify-between gap-3 border border-black/10 bg-white/45 px-3.5 py-3 text-[11px] text-black/40'>
            <span>开发环境</span>
            <span className='truncate font-mono'>admin@example.com</span>
          </div>
        )}
      </form>
    </div>
  );
}
