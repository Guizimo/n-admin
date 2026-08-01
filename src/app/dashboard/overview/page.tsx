'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip
} from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/layout/page-container';
import { useAuth } from '@/hooks/use-auth';
import {
  Activity,
  ChartNoAxesCombined,
  RefreshCw,
  ScrollText,
  ShieldCheck,
  Users,
  type LucideIcon
} from 'lucide-react';
import { formatDateTime } from '@/components/table/utils';
import { PageHeader } from '@/components/table/page-header';
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { DashboardAPI } from '@/service/request';
import { AiAPI } from '@/service/request';
import { toast } from 'sonner';
import { DashboardSkeleton } from '@/components/ui/dashboard-skeleton';
import { AiInsightsPanel } from '@/components/dashboard/ai-insights-panel';
import type { AiInsightsPayload } from '@/types/ai';

interface DashboardStats {
  overview: {
    totalUsers: number;
    todayUsers: number;
    weekUsers: number;
    userGrowthRate: string;
    totalRoles: number;
    totalPermissions: number;
    totalLogs: number;
    todayLogs: number;
    weekLogs: number;
    errorLogs: number;
  };
  recentUsers: Array<{
    id: number;
    username: string;
    email: string;
    avatar: string;
    createdAt: string;
  }>;
  logLevelStats: Array<{
    level: string;
    count: number;
  }>;
  userTrend: Array<{
    date: string;
    users: number;
  }>;
}

interface MetricCardProps {
  title: string;
  value: number;
  note: string;
  detail: string;
  icon: LucideIcon;
  tone: string;
}

function MetricCard({
  title,
  value,
  note,
  detail,
  icon: Icon,
  tone
}: MetricCardProps) {
  return (
    <Card className='py-0'>
      <CardContent className='flex items-start justify-between gap-4 py-4'>
        <div className='min-w-0 space-y-3'>
          <p className='text-muted-foreground text-sm font-medium'>{title}</p>
          <div>
            <p className='text-3xl font-semibold tabular-nums'>
              {value.toLocaleString()}
            </p>
            <p className='text-foreground mt-2 text-sm'>{note}</p>
            <p className='text-muted-foreground mt-1 text-xs'>{detail}</p>
          </div>
        </div>
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-md ${tone}`}
        >
          <Icon className='size-5' />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardOverview() {
  const { session } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState<AiInsightsPayload | null>(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [isChangingRange, setIsChangingRange] = useState(false);

  const user = {
    username: '游客',
    email: '未登录',
    avatar: '/avatars/default.jpg',
    ...session?.user
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await DashboardAPI.getStats();
      if (res.code === 0) {
        setStats(res.data);
      } else {
        toast.error(res.message || '获取dashboard数据失败');
      }
    } catch (error) {
      console.error('获取dashboard数据失败:', error);
      toast.error('网络请求失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  const fetchAiInsights = async () => {
    try {
      setAiLoading(true);
      const res = await AiAPI.getInsights();
      if (res.code === 0) {
        setAiInsights(res.data);
      } else {
        toast.error(res.message || '获取智能洞察失败');
      }
    } catch (error) {
      console.error('获取智能洞察失败:', error);
      toast.error('智能洞察请求失败，请检查网络连接');
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchAiInsights();
  }, []);

  const handleTimeRangeChange = (newRange: string) => {
    setIsChangingRange(true);
    setTimeRange(newRange);
    setTimeout(() => setIsChangingRange(false), 300);
  };

  if (loading) {
    return (
      <PageContainer scrollable={false}>
        <DashboardSkeleton />
      </PageContainer>
    );
  }

  const chartConfig = {
    users: {
      label: '用户数',
      color: 'hsl(var(--chart-1))'
    }
  } satisfies ChartConfig;

  const getChartData = () => {
    if (stats?.userTrend && stats.userTrend.length > 0) {
      const allData = stats.userTrend.map((item) => ({
        date: new Date(item.date).toLocaleDateString('zh-CN', {
          month: 'short',
          day: 'numeric'
        }),
        users: item.users,
        originalDate: new Date(item.date)
      }));

      const now = new Date();
      const filterDate = new Date();

      if (timeRange === '3d') {
        filterDate.setDate(now.getDate() - 3);
      } else if (timeRange === '7d') {
        filterDate.setDate(now.getDate() - 7);
      } else if (timeRange === '30d') {
        filterDate.setDate(now.getDate() - 30);
      }

      return allData
        .filter((item) => item.originalDate >= filterDate)
        .sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime())
        .map((item) => ({ date: item.date, users: item.users }));
    }

    return [];
  };

  const chartData = getChartData();
  const overview = stats?.overview;
  const errorRate = overview?.totalLogs
    ? ((overview.errorLogs / overview.totalLogs) * 100).toFixed(2)
    : '0.00';

  return (
    <PageContainer>
      <div className='w-full min-w-0 space-y-5 pb-6'>
        <PageHeader
          eyebrow='AI Operations Center'
          title={`欢迎回来，${user.username}`}
          description='查看系统运行状态、账号变化和需要关注的事项'
          action={{
            label: '刷新数据',
            onClick: fetchStats,
            icon: <RefreshCw className='mr-2 h-4 w-4' />
          }}
        />

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <MetricCard
            title='总用户数'
            value={overview?.totalUsers || 0}
            note={`今日新增 ${overview?.todayUsers || 0} 位`}
            detail={`近 7 天新增 ${overview?.weekUsers || 0} 位`}
            icon={Users}
            tone='border border-[#32d6b4]/25 bg-[#32d6b4]/10 text-[#32d6b4]'
          />
          <MetricCard
            title='近 7 天新增'
            value={overview?.weekUsers || 0}
            note={`增长率 ${overview?.userGrowthRate || '0%'}`}
            detail='按账号创建时间统计'
            icon={Activity}
            tone='border border-[#32d6b4]/25 bg-[#32d6b4]/10 text-[#32d6b4]'
          />
          <MetricCard
            title='系统角色'
            value={overview?.totalRoles || 0}
            note={`${overview?.totalPermissions || 0} 个权限节点`}
            detail='角色与权限配置总览'
            icon={ShieldCheck}
            tone='border border-[#f2c94c]/25 bg-[#f2c94c]/10 text-[#f2c94c]'
          />
          <MetricCard
            title='系统日志'
            value={overview?.totalLogs || 0}
            note={`今日记录 ${overview?.todayLogs || 0} 条`}
            detail={`错误日志 ${overview?.errorLogs || 0} 条`}
            icon={ScrollText}
            tone='border border-[#ff725e]/25 bg-[#ff725e]/10 text-[#ff725e]'
          />
        </div>

        <AiInsightsPanel
          data={aiInsights}
          loading={aiLoading}
          onRefresh={fetchAiInsights}
        />

        <div className='w-full'>
          <Card>
            <CardHeader>
              <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div className='space-y-1'>
                  <CardTitle className='text-lg font-semibold'>
                    用户活动趋势
                  </CardTitle>
                  <CardDescription className='text-muted-foreground text-sm'>
                    过去
                    {timeRange === '30d'
                      ? '30天'
                      : timeRange === '7d'
                        ? '7天'
                        : '3天'}
                    的用户注册情况
                  </CardDescription>
                </div>
                <div className='bg-muted flex w-fit rounded-md p-1'>
                  {[
                    { key: '3d', label: '3天' },
                    { key: '7d', label: '7天' },
                    { key: '30d', label: '30天' }
                  ].map((option) => (
                    <Button
                      key={option.key}
                      variant={timeRange === option.key ? 'secondary' : 'ghost'}
                      size='sm'
                      onClick={() => handleTimeRangeChange(option.key)}
                      className={`h-7 px-3 text-xs ${timeRange === option.key ? 'bg-background shadow-sm' : ''}`}
                      disabled={isChangingRange}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className='px-2 pb-4 sm:px-6'>
              <div className='h-[280px] w-full sm:h-[320px] lg:h-[380px]'>
                {chartData && chartData.length > 0 ? (
                  <ChartContainer
                    config={chartConfig}
                    className='h-full w-full'
                  >
                    <AreaChart
                      data={chartData}
                      margin={{
                        left: 0,
                        right: 20,
                        top: 20,
                        bottom: 20
                      }}
                    >
                      <defs>
                        <linearGradient
                          id='colorUsers'
                          x1='0'
                          y1='0'
                          x2='0'
                          y2='1'
                        >
                          <stop
                            offset='5%'
                            stopColor='hsl(var(--chart-1))'
                            stopOpacity={0.3}
                          />
                          <stop
                            offset='95%'
                            stopColor='hsl(var(--chart-1))'
                            stopOpacity={0.05}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray='3 3' opacity={0.3} />
                      <XAxis
                        dataKey='date'
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 11,
                          fill: 'hsl(var(--muted-foreground))'
                        }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 11,
                          fill: 'hsl(var(--muted-foreground))'
                        }}
                        dx={-10}
                      />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className='bg-background rounded-lg border p-3 shadow-md'>
                                <p className='text-sm font-medium'>{label}</p>
                                <p className='text-muted-foreground text-sm'>
                                  用户数:{' '}
                                  <span className='text-foreground font-semibold'>
                                    {payload[0].value}
                                  </span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type='monotone'
                        dataKey='users'
                        stroke='hsl(var(--chart-1))'
                        strokeWidth={2}
                        fill='url(#colorUsers)'
                        dot={{
                          fill: 'hsl(var(--chart-1))',
                          strokeWidth: 2,
                          r: 3
                        }}
                        activeDot={{
                          r: 5,
                          stroke: 'hsl(var(--chart-1))',
                          strokeWidth: 2
                        }}
                      />
                    </AreaChart>
                  </ChartContainer>
                ) : (
                  <div className='flex h-full w-full items-center justify-center rounded-md border border-dashed'>
                    <div className='text-center'>
                      <ChartNoAxesCombined className='text-muted-foreground mx-auto mb-3 size-6' />
                      <p className='text-muted-foreground mb-1 text-sm font-medium'>
                        {loading
                          ? '正在加载图表数据...'
                          : isChangingRange
                            ? '正在切换时间范围...'
                            : '暂无图表数据'}
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        {loading || isChangingRange
                          ? '请稍候'
                          : '请稍后再试或联系管理员'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>最近注册</CardTitle>
              <CardDescription>新用户注册列表</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {stats?.recentUsers?.length ? (
                  stats.recentUsers.slice(0, 3).map((recentUser) => (
                    <div
                      key={recentUser.id}
                      className='flex items-center justify-between'
                    >
                      <div className='flex min-w-0 items-center space-x-3'>
                        <div className='bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium'>
                          {recentUser.username.charAt(0).toUpperCase()}
                        </div>
                        <div className='min-w-0'>
                          <p className='truncate text-sm font-medium'>
                            {recentUser.username}
                          </p>
                          <p className='text-muted-foreground truncate text-xs'>
                            {recentUser.email}
                          </p>
                        </div>
                      </div>
                      <div className='text-muted-foreground ml-3 shrink-0 text-xs'>
                        {formatDateTime(recentUser.createdAt).split(' ')[0]}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='text-muted-foreground py-4 text-center'>
                    暂无数据
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-base'>日志分布</CardTitle>
              <CardDescription>按级别统计</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {stats?.logLevelStats?.map((stat, index) => {
                  const colors = ['#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
                  return (
                    <div
                      key={stat.level}
                      className='flex items-center justify-between'
                    >
                      <div className='flex items-center gap-2'>
                        <div
                          className='h-3 w-3 rounded-full'
                          style={{ backgroundColor: colors[index % 4] }}
                        />
                        <span className='text-sm font-medium capitalize'>
                          {stat.level}
                        </span>
                      </div>
                      <span className='text-sm font-bold'>{stat.count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-base'>系统状态</CardTitle>
              <CardDescription>运行状态监控</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    系统状态
                  </span>
                  <Badge
                    variant='default'
                    className='border border-[#32d6b4]/25 bg-[#32d6b4]/10 text-[#32d6b4]'
                  >
                    正常运行
                  </Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    本周用户
                  </span>
                  <span className='font-medium'>
                    {overview?.weekUsers || 0}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    本周日志
                  </span>
                  <span className='font-medium'>{overview?.weekLogs || 0}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>错误率</span>
                  <span
                    className={`font-medium ${overview?.errorLogs ? 'text-red-600' : 'text-emerald-600'}`}
                  >
                    {errorRate}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
