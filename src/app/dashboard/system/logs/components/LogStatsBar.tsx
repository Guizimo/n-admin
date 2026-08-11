import {
  Activity,
  CalendarDays,
  CalendarRange,
  CircleAlert
} from 'lucide-react';
import type { LogStats } from '../types';

interface LogStatsBarProps {
  stats: LogStats | null;
}

export function LogStatsBar({ stats }: LogStatsBarProps) {
  const errorCount =
    stats?.levelStats.find((item) => item.level === 'error')?.count ?? 0;
  const items = [
    {
      label: '日志总量',
      value: stats?.overview.total,
      icon: Activity
    },
    {
      label: '今日记录',
      value: stats?.overview.today,
      icon: CalendarDays
    },
    {
      label: '本周记录',
      value: stats?.overview.week,
      icon: CalendarRange
    },
    {
      label: '错误事件',
      value: errorCount,
      icon: CircleAlert,
      critical: errorCount > 0
    }
  ];

  return (
    <div className='border-border bg-card grid min-h-20 grid-cols-2 border-y lg:grid-cols-4'>
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className={`flex min-w-0 items-center gap-3 px-4 py-3 ${
              index % 2 !== 0 ? 'border-border border-l' : ''
            } ${index >= 2 ? 'border-border border-t lg:border-t-0' : ''} ${
              index > 0 ? 'lg:border-border lg:border-l' : ''
            }`}
          >
            <Icon
              className={`size-4 shrink-0 ${
                item.critical ? 'text-destructive' : 'text-muted-foreground'
              }`}
              aria-hidden='true'
            />
            <div className='min-w-0'>
              <p className='text-muted-foreground truncate text-xs'>
                {item.label}
              </p>
              <p
                className={`mt-1 text-lg font-semibold tabular-nums ${
                  item.critical ? 'text-destructive' : 'text-foreground'
                }`}
              >
                {item.value ?? '--'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
