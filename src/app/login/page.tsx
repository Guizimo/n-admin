import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  CircleDot,
  ScanSearch,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { LoginForm } from './components/login-form';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `登录 - ${siteConfig.name}`,
  description: `登录 ${siteConfig.name} 管理工作台`
};

const systemSignals = [
  {
    icon: ShieldCheck,
    label: '权限边界',
    value: '运行正常',
    color: 'text-[#32d6b4]'
  },
  {
    icon: ScanSearch,
    label: '风险洞察',
    value: '持续分析',
    color: 'text-[#f2c94c]'
  },
  {
    icon: Activity,
    label: '审计记录',
    value: '完整开启',
    color: 'text-[#73a7ff]'
  }
];

export default function Page() {
  return (
    <main className='grid min-h-svh bg-[#f5f6f2] text-[#171a1b] lg:grid-cols-[1.08fr_0.92fr]'>
      <section className='relative hidden min-h-svh overflow-hidden bg-[#15191a] text-white lg:flex lg:flex-col'>
        <div className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:48px_48px]' />

        <div className='relative z-10 flex items-center justify-between px-10 py-8 xl:px-14'>
          <Link
            href='/'
            className='flex items-center gap-3'
            aria-label='返回首页'
          >
            <Image src='/logo.png' alt='' width={34} height={34} priority />
            <span className='text-sm font-semibold'>{siteConfig.name}</span>
          </Link>
          <div className='flex items-center gap-2 text-xs text-white/45'>
            <CircleDot className='h-3.5 w-3.5 text-[#32d6b4]' />
            服务在线
          </div>
        </div>

        <div className='relative z-10 flex flex-1 flex-col justify-center px-10 py-12 xl:px-14 2xl:px-20'>
          <div className='max-w-2xl'>
            <div className='mb-8 inline-flex items-center gap-2 border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/65'>
              <Sparkles className='h-3.5 w-3.5 text-[#f2c94c]' />
              AI Operations Center
            </div>
            <h1 className='max-w-xl text-5xl leading-[1.05] font-semibold tracking-[0] xl:text-6xl'>
              先理解系统，
              <br />
              再安全进入
            </h1>
            <p className='mt-7 max-w-xl text-base leading-7 text-white/45'>
              N Admin
              将权限、操作与风险放在同一条审计链上，帮助管理者看清系统状态，再做出安全的决定。
            </p>
          </div>

          <div className='mt-14 max-w-2xl border-y border-white/10'>
            <div className='grid grid-cols-3 divide-x divide-white/10'>
              {systemSignals.map((signal) => {
                const Icon = signal.icon;
                return (
                  <div key={signal.label} className='px-5 py-5 first:pl-0'>
                    <Icon className={`mb-5 h-4 w-4 ${signal.color}`} />
                    <p className='text-xs text-white/35'>{signal.label}</p>
                    <p className='mt-1.5 text-sm font-medium text-white/80'>
                      {signal.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className='mt-8 flex max-w-2xl items-start gap-3 border border-white/10 bg-white/[0.035] p-4'>
            <div className='mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center bg-[#32d6b4]/10'>
              <CheckCircle2 className='h-4 w-4 text-[#32d6b4]' />
            </div>
            <div>
              <p className='text-sm font-medium text-white/80'>
                身份验证受保护
              </p>
              <p className='mt-1 text-xs leading-5 text-white/35'>
                登录行为会记录到系统审计日志，异常尝试将进入风险分析流程。
              </p>
            </div>
          </div>
        </div>

        <div className='relative z-10 flex items-center justify-between px-10 py-8 text-[11px] text-white/30 xl:px-14'>
          <span>N Admin v0.4.0</span>
          <span>Explainable · Auditable · Actionable</span>
        </div>
      </section>

      <section className='relative flex min-h-svh flex-col'>
        <div className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(23,26,27,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,26,27,0.045)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)] lg:hidden' />

        <header className='relative z-10 flex h-18 items-center justify-between px-5 sm:px-8 lg:justify-end lg:px-10'>
          <Link href='/' className='flex items-center gap-2.5 lg:hidden'>
            <Image src='/logo.png' alt='' width={30} height={30} priority />
            <span className='text-sm font-semibold'>{siteConfig.name}</span>
          </Link>
          <Link
            href='/'
            className='inline-flex h-9 items-center gap-2 px-2 text-xs font-medium text-black/45 transition-colors hover:text-black'
          >
            <ArrowLeft className='h-3.5 w-3.5' />
            返回首页
          </Link>
        </header>

        <div className='relative z-10 flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12'>
          <div className='w-full max-w-[420px]'>
            <div className='mb-9'>
              <div className='mb-7 flex h-10 w-10 items-center justify-center border border-black/15 bg-white lg:hidden'>
                <ShieldCheck className='h-5 w-5 text-[#007d6e]' />
              </div>
              <p className='mb-3 text-xs font-semibold tracking-[0.16em] text-[#007d6e] uppercase'>
                Secure workspace
              </p>
              <h2 className='text-3xl font-semibold tracking-[0] sm:text-4xl'>
                欢迎回来
              </h2>
              <p className='mt-3 text-sm leading-6 text-black/50'>
                使用组织分配的账号登录管理工作台。
              </p>
            </div>

            <LoginForm />

            <div className='mt-8 flex items-start gap-2.5 border-t border-black/10 pt-5 text-xs leading-5 text-black/40'>
              <ShieldCheck className='mt-0.5 h-3.5 w-3.5 shrink-0 text-[#007d6e]' />
              <p>
                账号由系统管理员统一创建与授权。如无法登录，请联系管理员检查账号状态和角色权限。
              </p>
            </div>
          </div>
        </div>

        <footer className='relative z-10 flex items-center justify-between px-5 py-6 text-[11px] text-black/30 sm:px-8 lg:px-10'>
          <span>© {new Date().getFullYear()} Guizimo</span>
          <span>加密连接</span>
        </footer>
      </section>
    </main>
  );
}
