'use client';

import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  ClipboardList,
  KeyRound,
  Loader2,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { AiInsightSeverity, AiInsightsPayload } from '@/types/ai';

interface AiInsightsPanelProps {
  data: AiInsightsPayload | null;
  loading: boolean;
  onRefresh: () => void;
}

const severityConfig: Record<
  AiInsightSeverity,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    icon: React.ReactNode;
  }
> = {
  high: {
    label: '高风险',
    variant: 'destructive',
    icon: <AlertTriangle className='h-3 w-3' />
  },
  medium: {
    label: '需关注',
    variant: 'secondary',
    icon: <ShieldCheck className='h-3 w-3' />
  },
  low: {
    label: '稳定',
    variant: 'outline',
    icon: <CheckCircle2 className='h-3 w-3' />
  }
};

function getScoreTone(score: number) {
  if (score >= 85) {
    return 'text-emerald-600';
  }

  if (score >= 65) {
    return 'text-amber-600';
  }

  return 'text-red-600';
}

export function AiInsightsPanel({
  data,
  loading,
  onRefresh
}: AiInsightsPanelProps) {
  return (
    <div className='grid gap-4 lg:grid-cols-[1.2fr_0.8fr]'>
      <Card>
        <CardHeader>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='space-y-1'>
              <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
                <Bot className='h-5 w-5' />
                智能管理员助手
              </CardTitle>
              <CardDescription>
                {data?.summary || '正在读取系统日志、权限和账号状态'}
              </CardDescription>
            </div>
            <div className='flex items-center gap-3'>
              <div className='text-right'>
                <div
                  className={`text-2xl font-bold ${getScoreTone(data?.healthScore || 0)}`}
                >
                  {data?.healthScore ?? '--'}
                </div>
                <div className='text-muted-foreground text-xs'>健康分</div>
              </div>
              <Button
                variant='outline'
                size='icon'
                onClick={onRefresh}
                disabled={loading}
                aria-label='刷新智能洞察'
              >
                {loading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <RefreshCw className='h-4 w-4' />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex h-40 items-center justify-center'>
              <Loader2 className='text-muted-foreground h-6 w-6 animate-spin' />
            </div>
          ) : (
            <div className='space-y-4'>
              {data?.insights.map((insight) => {
                const severity = severityConfig[insight.severity];

                return (
                  <div key={insight.id} className='rounded-md border p-4'>
                    <div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
                      <div className='space-y-1'>
                        <div className='flex items-center gap-2'>
                          <h3 className='text-sm font-semibold'>
                            {insight.title}
                          </h3>
                          <Badge variant={severity.variant}>
                            {severity.icon}
                            {severity.label}
                          </Badge>
                        </div>
                        <p className='text-muted-foreground text-sm'>
                          {insight.summary}
                        </p>
                      </div>
                    </div>
                    <div className='mt-3 grid gap-3 md:grid-cols-2'>
                      <div>
                        <div className='text-muted-foreground mb-2 text-xs font-medium'>
                          证据
                        </div>
                        <div className='space-y-1'>
                          {insight.evidence.slice(0, 4).map((item) => (
                            <p key={item} className='text-sm'>
                              {item}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className='text-muted-foreground mb-2 text-xs font-medium'>
                          建议
                        </div>
                        <p className='text-sm'>{insight.recommendation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className='space-y-4'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base'>
              <KeyRound className='h-4 w-4' />
              权限解释
            </CardTitle>
            <CardDescription>
              {data?.permissionExplanation.summary || '暂无权限摘要'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              {data?.permissionExplanation.details.map((detail) => (
                <p key={detail} className='text-muted-foreground text-sm'>
                  {detail}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base'>
              <ClipboardList className='h-4 w-4' />
              操作草案
            </CardTitle>
            <CardDescription>按风险优先级生成的管理员待办</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {data?.actionDrafts.map((draft, index) => (
                <div key={draft.id} className='space-y-3'>
                  {index > 0 && <Separator />}
                  <div className='space-y-1'>
                    <div className='flex items-center justify-between gap-2'>
                      <h3 className='text-sm font-semibold'>{draft.title}</h3>
                      {draft.requiresApproval && (
                        <Badge variant='secondary'>需确认</Badge>
                      )}
                    </div>
                    <p className='text-muted-foreground text-sm'>
                      {draft.description}
                    </p>
                  </div>
                  <div className='space-y-1'>
                    {draft.steps.slice(0, 3).map((step) => (
                      <div key={step} className='flex gap-2 text-sm'>
                        <CheckCircle2 className='mt-0.5 h-3.5 w-3.5 shrink-0' />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {!loading && !data?.actionDrafts.length && (
                <p className='text-muted-foreground py-4 text-center text-sm'>
                  暂无待办
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
