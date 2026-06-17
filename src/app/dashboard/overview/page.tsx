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
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
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

  // 处理时间范围改变
  const handleTimeRangeChange = (newRange: string) => {
    setIsChangingRange(true);
    setTimeRange(newRange);
    // 添加一个短暂的延迟来显示切换效果
    setTimeout(() => setIsChangingRange(false), 300);
  };

  if (loading) {
    return (
      <PageContainer scrollable={false}>
        <DashboardSkeleton />
      </PageContainer>
    );
  }

  // 图表配置
  const chartConfig = {
    users: {
      label: '用户数',
      color: 'hsl(var(--chart-1))'
    }
  } satisfies ChartConfig;

  // 处理真实的图表数据，根据timeRange过滤
  const getChartData = () => {
    // 如果有真实数据，使用真实数据
    if (stats?.userTrend && stats.userTrend.length > 0) {
      const allData = stats.userTrend.map((item) => ({
        date: new Date(item.date).toLocaleDateString('zh-CN', {
          month: 'short',
          day: 'numeric'
        }),
        users: item.users,
        originalDate: new Date(item.date)
      }));

      // 根据timeRange过滤数据
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

    // 如果没有真实数据，生成示例数据用于展示
    const now = new Date();
    const data = [];
    let days = 7;

    if (timeRange === '30d') days = 30;
    else if (timeRange === '7d') days = 7;
    else if (timeRange === '3d') days = 3;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric'
      });

      // 生成示例数据
      const baseUsers = 40;
      const dailyVariation = Math.sin(i * 0.5) * 15 + Math.random() * 8;
      const users = Math.max(0, Math.round(baseUsers + dailyVariation));

      data.push({ date: dateStr, users });
    }

    return data;
  };

  const chartData = getChartData();

  const isPositiveGrowth = stats?.overview.userGrowthRate.startsWith('+');
  const weekGrowthRate = '+12.5%'; // 示例数据
  const roleGrowthRate = '+4.5%'; // 示例数据
  const logGrowthRate = '-8.2%'; // 示例数据

  return (
    <PageContainer scrollable={false}>
      <div className='flex h-[calc(100vh-8rem)] w-full flex-col space-y-6 overflow-y-auto'>
        {/* 页面头部 */}
        <PageHeader
          title={`欢迎回来，${user.username} 👋`}
          description='这里是您的系统概览和关键指标'
          action={{
            label: '刷新数据',
            onClick: fetchStats,
            icon: <RefreshCw className='mr-2 h-4 w-4' />
          }}
        />

        {/* 统计卡片 */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>总用户数</CardTitle>
              <Badge
                variant={isPositiveGrowth ? 'default' : 'destructive'}
                className='ml-auto'
              >
                {isPositiveGrowth ? (
                  <TrendingUp className='mr-1 h-3 w-3' />
                ) : (
                  <TrendingDown className='mr-1 h-3 w-3' />
                )}
                {stats?.overview.userGrowthRate || '+0%'}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {stats?.overview.totalUsers?.toLocaleString() || 0}
              </div>
              <p className='text-muted-foreground text-xs'>
                本月新增用户趋势向上
              </p>
              <p className='text-muted-foreground mt-1 text-xs'>
                今日注册 {stats?.overview.todayUsers || 0} 位新用户
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>本周活跃</CardTitle>
              <Badge variant='default' className='ml-auto'>
                <TrendingUp className='mr-1 h-3 w-3' />
                {weekGrowthRate}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {stats?.overview.weekUsers?.toLocaleString() || 0}
              </div>
              <p className='text-muted-foreground text-xs'>
                用户活跃度稳步提升
              </p>
              <p className='text-muted-foreground mt-1 text-xs'>
                用户参与度超出预期目标
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>系统角色</CardTitle>
              <Badge variant='default' className='ml-auto'>
                <TrendingUp className='mr-1 h-3 w-3' />
                {roleGrowthRate}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {stats?.overview.totalRoles || 0}
              </div>
              <p className='text-muted-foreground text-xs'>角色配置持续优化</p>
              <p className='text-muted-foreground mt-1 text-xs'>
                权限节点: {stats?.overview.totalPermissions || 0} 个
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>系统日志</CardTitle>
              <Badge variant='destructive' className='ml-auto'>
                <TrendingDown className='mr-1 h-3 w-3' />
                {logGrowthRate}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {stats?.overview.totalLogs?.toLocaleString() || 0}
              </div>
              <p className='text-muted-foreground text-xs'>日志量环比下降</p>
              <p className='text-muted-foreground mt-1 text-xs'>
                今日 {stats?.overview.todayLogs || 0} 条 | 错误{' '}
                {stats?.overview.errorLogs || 0} 条
              </p>
            </CardContent>
          </Card>
        </div>

        <AiInsightsPanel
          data={aiInsights}
          loading={aiLoading}
          onRefresh={fetchAiInsights}
        />

        {/* 主图表区域 */}
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
                <div className='flex gap-1'>
                  {[
                    { key: '3d', label: '3天' },
                    { key: '7d', label: '7天' },
                    { key: '30d', label: '30天' }
                  ].map((option) => (
                    <Button
                      key={option.key}
                      variant={timeRange === option.key ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => handleTimeRangeChange(option.key)}
                      className='h-8 px-3 text-xs'
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
                  <div className='flex h-full w-full items-center justify-center'>
                    <div className='text-center'>
                      <div className='text-muted-foreground mb-3 text-2xl'>
                        📊
                      </div>
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

        {/* 详细信息网格 */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {/* 最近用户 */}
          <Card>
            <CardHeader>
              <CardTitle>最近注册</CardTitle>
              <CardDescription>新用户注册列表</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {stats?.recentUsers?.slice(0, 3).map((user, index) => (
                  <div
                    key={user.id}
                    className='flex items-center justify-between'
                  >
                    <div className='flex items-center space-x-3'>
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-white ${
                          index === 0
                            ? 'bg-blue-500'
                            : index === 1
                              ? 'bg-green-500'
                              : 'bg-purple-500'
                        }`}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className='text-sm font-medium'>{user.username}</p>
                        <p className='text-muted-foreground text-xs'>
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className='text-muted-foreground text-xs'>
                      {formatDateTime(user.createdAt).split(' ')[0]}
                    </div>
                  </div>
                )) || (
                  <p className='text-muted-foreground py-4 text-center'>
                    暂无数据
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 日志分布 */}
          <Card>
            <CardHeader>
              <CardTitle>日志分布</CardTitle>
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

          {/* 系统状态 */}
          <Card>
            <CardHeader>
              <CardTitle>系统状态</CardTitle>
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
                    className='bg-green-100 text-green-800'
                  >
                    正常运行
                  </Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    本周用户
                  </span>
                  <span className='font-medium'>
                    {stats?.overview.weekUsers || 0}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    本周日志
                  </span>
                  <span className='font-medium'>
                    {stats?.overview.weekLogs || 0}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>错误率</span>
                  <span
                    className={`font-medium ${stats?.overview.errorLogs ? 'text-red-600' : 'text-green-600'}`}
                  >
                    {stats?.overview.errorLogs ? '0.02%' : '0%'}
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
