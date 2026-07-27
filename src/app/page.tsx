'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Github,
  Menu,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { siteConfig } from '@/config/site';

const productSignals = [
  {
    icon: ScanSearch,
    eyebrow: '看见异常',
    title: '主动发现，而不只是展示',
    description:
      'AI 持续分析用户、权限与操作日志，在风险变成事故前给出可追溯的判断。',
    accent: 'text-[#007d6e]',
    marker: 'bg-[#32d6b4]'
  },
  {
    icon: ShieldCheck,
    eyebrow: '解释依据',
    title: '每条结论都带证据',
    description:
      '从洞察回到原始记录，清楚知道发生了什么、为什么重要，以及谁会受到影响。',
    accent: 'text-[#b83d2e]',
    marker: 'bg-[#ff725e]'
  },
  {
    icon: Workflow,
    eyebrow: '安全行动',
    title: '把建议变成受控执行',
    description:
      '高风险操作先生成草案，通过权限校验、人工确认与审计记录后再执行。',
    accent: 'text-[#765900]',
    marker: 'bg-[#f2c94c]'
  }
];

const flow = [
  { step: '01', title: '理解上下文', detail: '角色、权限、日志与业务状态' },
  { step: '02', title: '形成判断', detail: '结论、置信度与证据引用' },
  { step: '03', title: '生成方案', detail: '影响范围与可回退的操作草案' },
  { step: '04', title: '受控执行', detail: '确认、授权、执行与完整审计' }
];

function ProductPreview() {
  return (
    <div className='relative mx-auto h-[150px] w-full max-w-[1180px] overflow-hidden border-x border-t border-white/15 bg-[#111416] shadow-[0_-40px_100px_rgba(50,214,180,0.08)] sm:h-[220px] lg:h-[260px]'>
      <div className='flex h-12 items-center justify-between border-b border-white/10 px-4 sm:px-5'>
        <div className='flex items-center gap-2'>
          <span className='h-2.5 w-2.5 rounded-full bg-[#ff725e]' />
          <span className='h-2.5 w-2.5 rounded-full bg-[#f2c94c]' />
          <span className='h-2.5 w-2.5 rounded-full bg-[#32d6b4]' />
        </div>
        <div className='hidden items-center gap-2 text-xs text-white/45 sm:flex'>
          <CircleDot className='h-3.5 w-3.5 text-[#32d6b4]' />
          系统运行正常
        </div>
      </div>

      <div className='grid h-[calc(100%-3rem)] grid-cols-[58px_1fr] sm:grid-cols-[180px_1fr]'>
        <aside className='border-r border-white/10 p-3 sm:p-4'>
          <div className='mb-7 flex items-center gap-2'>
            <Image src='/logo.png' alt='' width={28} height={28} />
            <span className='hidden text-sm font-semibold text-white sm:block'>
              N Admin
            </span>
          </div>
          <div className='space-y-2'>
            {[
              ['概览', Activity],
              ['用户', Users],
              ['AI 助手', Sparkles],
              ['权限', ShieldCheck]
            ].map(([label, Icon], index) => {
              const NavIcon = Icon as typeof Activity;
              return (
                <div
                  key={label as string}
                  className={`flex h-9 items-center gap-2 px-2 text-xs ${
                    index === 2 ? 'bg-white text-[#111416]' : 'text-white/45'
                  }`}
                >
                  <NavIcon className='h-4 w-4 shrink-0' />
                  <span className='hidden sm:block'>{label as string}</span>
                </div>
              );
            })}
          </div>
        </aside>

        <div className='min-w-0 p-4 text-left sm:p-6 lg:p-8'>
          <div className='mb-6 flex items-start justify-between gap-4'>
            <div>
              <p className='mb-1 text-[10px] font-semibold tracking-[0.18em] text-[#32d6b4] uppercase sm:text-xs'>
                AI Operations Center
              </p>
              <h2 className='text-xl font-semibold text-white sm:text-2xl'>
                早上好，Guizimo
              </h2>
            </div>
            <div className='flex h-9 w-9 items-center justify-center border border-white/15 bg-white/5'>
              <Bot className='h-4 w-4 text-white/70' />
            </div>
          </div>

          <div className='mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3'>
            {[
              ['活跃用户', '1,284', '+12%'],
              ['角色', '18', '稳定'],
              ['待审查', '07', '需关注'],
              ['风险事件', '03', '-2']
            ].map(([label, value, change], index) => (
              <div
                key={label}
                className='border border-white/10 bg-white/[0.035] p-3'
              >
                <p className='truncate text-[10px] text-white/40 sm:text-xs'>
                  {label}
                </p>
                <div className='mt-2 flex items-end justify-between gap-1'>
                  <span className='text-lg font-semibold text-white sm:text-xl'>
                    {value}
                  </span>
                  <span
                    className={`hidden text-[10px] sm:block ${
                      index === 2 ? 'text-[#ff725e]' : 'text-[#32d6b4]'
                    }`}
                  >
                    {change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className='grid gap-3 lg:grid-cols-[1.08fr_0.92fr]'>
            <div className='border border-white/10 bg-white/[0.035] p-4 sm:p-5'>
              <div className='mb-4 flex items-center justify-between'>
                <div className='flex items-center gap-2 text-sm font-medium text-white'>
                  <Sparkles className='h-4 w-4 text-[#f2c94c]' />
                  今日洞察
                </div>
                <span className='text-[10px] text-white/35'>刚刚更新</span>
              </div>
              <div className='space-y-3'>
                <div className='border-l-2 border-[#ff725e] bg-[#ff725e]/5 px-3 py-3'>
                  <div className='mb-1 flex items-center justify-between gap-3'>
                    <p className='truncate text-xs font-medium text-white sm:text-sm'>
                      发现 3 个长期未使用的高权限账号
                    </p>
                    <span className='text-[9px] text-[#ff9b8d]'>高优先级</span>
                  </div>
                  <p className='line-clamp-2 text-[10px] leading-4 text-white/40 sm:text-xs'>
                    过去 90 天无登录记录，但仍持有用户删除与角色配置权限。
                  </p>
                </div>
                <div className='border-l-2 border-[#f2c94c] bg-[#f2c94c]/5 px-3 py-3'>
                  <p className='mb-1 truncate text-xs font-medium text-white sm:text-sm'>
                    财务角色存在权限重叠
                  </p>
                  <p className='line-clamp-2 text-[10px] leading-4 text-white/40 sm:text-xs'>
                    建议合并 2 条重复策略，可减少后续维护成本。
                  </p>
                </div>
              </div>
            </div>

            <div className='hidden border border-white/10 bg-white/[0.035] p-5 lg:block'>
              <div className='mb-5 flex items-center justify-between'>
                <p className='text-sm font-medium text-white'>权限健康度</p>
                <span className='text-xs text-[#32d6b4]'>良好</span>
              </div>
              <div className='mb-5 flex items-end gap-3'>
                <span className='text-4xl font-semibold text-white'>86</span>
                <span className='pb-1 text-xs text-white/35'>/ 100</span>
              </div>
              <div className='mb-6 h-1.5 overflow-hidden bg-white/10'>
                <div className='h-full w-[86%] bg-[#32d6b4]' />
              </div>
              <div className='space-y-3 text-xs'>
                {['权限边界清晰', '关键操作已审计', '3 项建议待处理'].map(
                  (item, index) => (
                    <div
                      key={item}
                      className='flex items-center gap-2 text-white/50'
                    >
                      {index < 2 ? (
                        <CheckCircle2 className='h-3.5 w-3.5 text-[#32d6b4]' />
                      ) : (
                        <CircleDot className='h-3.5 w-3.5 text-[#f2c94c]' />
                      )}
                      {item}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className='min-h-screen overflow-x-hidden bg-[#f5f6f2] text-[#171a1b]'>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200 ${
          scrolled
            ? 'border-black/10 bg-[#f5f6f2]/95 backdrop-blur-md'
            : 'border-transparent bg-transparent'
        }`}
      >
        <div className='mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 sm:px-8'>
          <Link
            href='/'
            className='flex items-center gap-2.5'
            aria-label='N Admin 首页'
          >
            <Image src='/logo.png' alt='' width={30} height={30} priority />
            <span className='text-sm font-semibold tracking-wide'>
              {siteConfig.name}
            </span>
          </Link>

          <nav className='hidden items-center gap-8 text-sm text-black/55 md:flex'>
            <a href='#product' className='transition-colors hover:text-black'>
              产品
            </a>
            <a href='#workflow' className='transition-colors hover:text-black'>
              工作方式
            </a>
            <a
              href='#open-source'
              className='transition-colors hover:text-black'
            >
              开源
            </a>
          </nav>

          <div className='hidden items-center gap-2 md:flex'>
            <a
              href='https://github.com/guizimo/n-admin'
              target='_blank'
              rel='noreferrer'
              className='inline-flex h-9 items-center gap-2 px-3 text-sm text-black/55 transition-colors hover:text-black'
            >
              <Github className='h-4 w-4' />
              GitHub
            </a>
            <Link
              href='/login'
              className='inline-flex h-9 items-center gap-2 bg-[#171a1b] px-4 text-sm font-medium text-white transition-colors hover:bg-black'
            >
              进入系统
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>

          <button
            type='button'
            onClick={() => setMenuOpen((open) => !open)}
            className='flex h-9 w-9 items-center justify-center border border-black/15 md:hidden'
            aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className='h-4 w-4' />
            ) : (
              <Menu className='h-4 w-4' />
            )}
          </button>
        </div>

        {menuOpen && (
          <div className='border-t border-black/10 bg-[#f5f6f2] px-5 py-5 md:hidden'>
            <nav className='flex flex-col gap-4 text-sm'>
              <a href='#product' onClick={() => setMenuOpen(false)}>
                产品
              </a>
              <a href='#workflow' onClick={() => setMenuOpen(false)}>
                工作方式
              </a>
              <a href='#open-source' onClick={() => setMenuOpen(false)}>
                开源
              </a>
              <Link
                href='/login'
                className='mt-2 inline-flex h-10 items-center justify-center gap-2 bg-[#171a1b] px-4 font-medium text-white'
              >
                进入系统 <ArrowRight className='h-4 w-4' />
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main>
        <section className='relative flex flex-col overflow-hidden bg-[#f5f6f2] pt-16'>
          <div className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(23,26,27,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,26,27,0.055)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]' />
          <div className='relative z-10 mx-auto flex w-full max-w-[1040px] flex-col items-center justify-center px-5 pt-12 pb-10 text-center sm:px-8 sm:pt-16'>
            <div className='mb-7 inline-flex items-center gap-2 border border-black/15 bg-white/60 px-3 py-1.5 text-xs font-medium text-black/65'>
              <Sparkles className='h-3.5 w-3.5 text-[#007d6e]' />
              AI Native 管理操作系统
            </div>
            <h1 className='max-w-4xl text-[clamp(3rem,8vw,7.25rem)] leading-[0.92] font-semibold tracking-[0] text-[#171a1b]'>
              N Admin
            </h1>
            <p className='mt-5 max-w-3xl text-[clamp(1.8rem,4.5vw,4.25rem)] leading-[1.05] font-medium tracking-[0] text-black/78'>
              让后台先理解，再执行
            </p>
            <p className='mt-6 max-w-2xl text-base leading-7 text-black/55 sm:text-lg'>
              把用户、权限和操作日志变成有证据的洞察，
              <br className='hidden sm:block' />
              再通过授权、确认与审计，把建议安全地变成行动。
            </p>
            <div className='mt-8 flex flex-col items-center gap-3 sm:flex-row'>
              <Link
                href='/login'
                className='inline-flex h-12 min-w-40 items-center justify-center gap-2 bg-[#171a1b] px-5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5'
              >
                体验 N Admin
                <ArrowRight className='h-4 w-4' />
              </Link>
              <a
                href='#product'
                className='inline-flex h-12 min-w-40 items-center justify-center gap-2 border border-black/20 bg-white/50 px-5 text-sm font-medium transition-colors hover:bg-white'
              >
                看产品如何工作
                <ChevronRight className='h-4 w-4' />
              </a>
            </div>
          </div>
          <div className='relative z-10 px-3 sm:px-8'>
            <ProductPreview />
          </div>
        </section>

        <section id='product' className='border-t border-black/10 bg-white'>
          <div className='mx-auto max-w-[1280px] px-5 py-24 sm:px-8 sm:py-32'>
            <div className='grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24'>
              <div>
                <p className='mb-4 text-xs font-semibold tracking-[0.18em] text-[#007d6e] uppercase'>
                  Built for decisions
                </p>
                <h2 className='max-w-xl text-4xl leading-tight font-semibold tracking-[0] sm:text-5xl'>
                  不是另一个
                  <br />
                  等待点击的后台
                </h2>
              </div>
              <div className='flex items-end'>
                <p className='max-w-2xl text-lg leading-8 text-black/55 sm:text-xl'>
                  传统后台把数据留给人去寻找。N Admin
                  主动理解系统正在发生什么，给出判断依据，并把每一次行动约束在可控边界内。
                </p>
              </div>
            </div>

            <div className='mt-20 grid border-y border-black/10 md:grid-cols-3'>
              {productSignals.map((signal, index) => {
                const Icon = signal.icon;
                return (
                  <article
                    key={signal.title}
                    className={`py-10 md:px-8 md:py-12 ${
                      index > 0
                        ? 'border-t border-black/10 md:border-t-0 md:border-l'
                        : ''
                    }`}
                  >
                    <div className='mb-8 flex items-center justify-between'>
                      <div className='flex h-10 w-10 items-center justify-center border border-black/15'>
                        <Icon className={`h-5 w-5 ${signal.accent}`} />
                      </div>
                      <span
                        className={`h-2 w-2 rounded-full ${signal.marker}`}
                      />
                    </div>
                    <p className='mb-3 text-xs font-semibold tracking-[0.14em] text-black/40 uppercase'>
                      {signal.eyebrow}
                    </p>
                    <h3 className='mb-4 text-xl font-semibold'>
                      {signal.title}
                    </h3>
                    <p className='text-sm leading-6 text-black/55'>
                      {signal.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id='workflow' className='bg-[#171a1b] text-white'>
          <div className='mx-auto max-w-[1280px] px-5 py-24 sm:px-8 sm:py-32'>
            <div className='mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end'>
              <div>
                <p className='mb-4 text-xs font-semibold tracking-[0.18em] text-[#32d6b4] uppercase'>
                  Human in control
                </p>
                <h2 className='max-w-2xl text-4xl leading-tight font-semibold tracking-[0] sm:text-5xl'>
                  AI 提速，边界不让步
                </h2>
              </div>
              <p className='max-w-md text-sm leading-6 text-white/50'>
                AI
                可以提出建议和生成操作草案，但权限系统、人工确认与审计链始终掌握最终控制权。
              </p>
            </div>

            <div className='grid border-t border-white/15 md:grid-cols-4'>
              {flow.map((item, index) => (
                <div
                  key={item.step}
                  className={`relative border-b border-white/15 py-8 md:min-h-64 md:border-b-0 md:px-6 md:py-10 ${
                    index > 0 ? 'md:border-l' : ''
                  }`}
                >
                  <span className='text-xs font-medium text-[#32d6b4]'>
                    {item.step}
                  </span>
                  <div className='mt-16 md:mt-24'>
                    <h3 className='mb-2 text-lg font-medium'>{item.title}</h3>
                    <p className='text-sm leading-6 text-white/40'>
                      {item.detail}
                    </p>
                  </div>
                  {index < flow.length - 1 && (
                    <ArrowRight className='absolute top-9 right-5 hidden h-4 w-4 text-white/20 md:block' />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id='open-source' className='bg-[#dff7f0]'>
          <div className='mx-auto grid max-w-[1280px] gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[1fr_0.8fr] lg:items-center'>
            <div>
              <div className='mb-8 flex h-12 w-12 items-center justify-center bg-[#171a1b] text-white'>
                <Github className='h-5 w-5' />
              </div>
              <p className='mb-4 text-xs font-semibold tracking-[0.18em] text-[#007d6e] uppercase'>
                Open source, open path
              </p>
              <h2 className='max-w-2xl text-4xl leading-tight font-semibold tracking-[0] sm:text-5xl'>
                从今天的管理后台，走向下一代 AI 软件
              </h2>
              <p className='mt-6 max-w-2xl text-base leading-7 text-black/55'>
                N Admin 基于 Next.js 16、React 19、Drizzle ORM 与细粒度 RBAC
                构建。你可以直接使用，也可以沿着清晰的模块边界继续演进。
              </p>
              <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
                <a
                  href='https://github.com/guizimo/n-admin'
                  target='_blank'
                  rel='noreferrer'
                  className='inline-flex h-12 items-center justify-center gap-2 bg-[#171a1b] px-5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5'
                >
                  <Github className='h-4 w-4' />
                  查看源代码
                </a>
                <Link
                  href='/dashboard'
                  className='inline-flex h-12 items-center justify-center gap-2 border border-black/20 bg-transparent px-5 text-sm font-medium hover:bg-white/50'
                >
                  打开控制台
                  <ArrowRight className='h-4 w-4' />
                </Link>
              </div>
            </div>

            <div className='border-l border-black/15 pl-6 sm:pl-10'>
              <p className='mb-6 text-xs font-semibold tracking-[0.16em] text-black/40 uppercase'>
                Production foundation
              </p>
              <ul className='space-y-5'>
                {[
                  '用户、角色与权限完整闭环',
                  'AI 洞察与结构化分析接口',
                  '操作日志与可追溯审计',
                  '响应式工作台与明暗主题',
                  'TypeScript 端到端类型约束'
                ].map((item) => (
                  <li
                    key={item}
                    className='flex items-center gap-3 text-sm font-medium'
                  >
                    <span className='flex h-5 w-5 items-center justify-center bg-[#171a1b] text-white'>
                      <Check className='h-3 w-3' />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className='bg-[#f5f6f2]'>
        <div className='mx-auto flex max-w-[1280px] flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between'>
          <div className='flex items-center gap-2.5'>
            <Image src='/logo.png' alt='' width={28} height={28} />
            <span className='text-sm font-semibold'>{siteConfig.name}</span>
            <span className='ml-2 text-xs text-black/35'>AI Native Admin</span>
          </div>
          <div className='flex flex-wrap gap-x-6 gap-y-3 text-xs text-black/45'>
            <span>© {new Date().getFullYear()} Guizimo</span>
            <a
              href='https://github.com/guizimo/n-admin/issues'
              target='_blank'
              rel='noreferrer'
              className='hover:text-black'
            >
              反馈
            </a>
            <a
              href='https://blog.guizimo.com'
              target='_blank'
              rel='noreferrer'
              className='hover:text-black'
            >
              博客
            </a>
            <span>MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
