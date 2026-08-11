import React from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import {
  AlertCircle,
  Info,
  AlertTriangle,
  Bug,
  User,
  Globe,
  Clock,
  Hash
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface LogItem {
  id: number;
  level: string;
  action: string;
  module: string;
  message: string;
  details?: any;
  userId?: number;
  username?: string;
  userAgent?: string;
  ip?: string;
  requestId?: string;
  duration?: number;
  createdAt: string;
}

interface LogDetailDialogProps {
  log: LogItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const levelColors = {
  info: 'bg-blue-100 text-blue-800',
  warn: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  debug: 'bg-gray-100 text-gray-800'
};

const levelIcons = {
  info: Info,
  warn: AlertTriangle,
  error: AlertCircle,
  debug: Bug
};

export function LogDetailDialog({
  log,
  open,
  onOpenChange
}: LogDetailDialogProps) {
  if (!log) return null;

  const LevelIcon = levelIcons[log.level as keyof typeof levelIcons] || Info;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex max-h-[80vh] max-w-4xl flex-col overflow-hidden p-0'>
        <DialogHeader className='bg-background relative sticky top-0 z-10 shrink-0 border-b px-6 py-4 pr-16'>
          <DialogTitle className='flex items-center gap-2'>
            <LevelIcon className='h-5 w-5' />
            日志详情 #{log.id}
          </DialogTitle>
          <DialogDescription className='sr-only'>
            查看日志事件、请求与用户上下文
          </DialogDescription>
        </DialogHeader>

        <div className='flex-1 overflow-y-auto px-6 py-4'>
          <div className='space-y-6'>
            {/* 基本信息 */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='space-y-3'>
                <div>
                  <label className='text-muted-foreground text-sm font-medium'>
                    级别
                  </label>
                  <div className='mt-1'>
                    <Badge
                      className={
                        levelColors[log.level as keyof typeof levelColors]
                      }
                    >
                      {log.level.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className='text-muted-foreground text-sm font-medium'>
                    模块
                  </label>
                  <div className='mt-1 text-sm'>{log.module}</div>
                </div>

                <div>
                  <label className='text-muted-foreground text-sm font-medium'>
                    操作
                  </label>
                  <div className='mt-1 text-sm font-medium'>{log.action}</div>
                </div>
              </div>

              <div className='space-y-3'>
                <div>
                  <label className='text-muted-foreground text-sm font-medium'>
                    时间
                  </label>
                  <div className='mt-1 flex items-center gap-1 text-sm'>
                    <Clock className='h-4 w-4' />
                    {format(new Date(log.createdAt), 'yyyy-MM-dd HH:mm:ss', {
                      locale: zhCN
                    })}
                  </div>
                </div>

                {log.duration && (
                  <div>
                    <label className='text-muted-foreground text-sm font-medium'>
                      执行时间
                    </label>
                    <div className='mt-1 text-sm'>{log.duration}ms</div>
                  </div>
                )}

                {log.requestId && (
                  <div>
                    <label className='text-muted-foreground text-sm font-medium'>
                      请求ID
                    </label>
                    <div className='mt-1 flex items-center gap-1 text-sm'>
                      <Hash className='h-4 w-4' />
                      <code className='bg-muted rounded px-2 py-1 text-xs'>
                        {log.requestId}
                      </code>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 消息内容 */}
            <div>
              <label className='text-muted-foreground text-sm font-medium'>
                消息
              </label>
              <div className='bg-muted mt-1 rounded-md p-3 text-sm'>
                {log.message}
              </div>
            </div>

            {/* 用户信息 */}
            {(log.username || log.ip) && (
              <div>
                <label className='text-muted-foreground text-sm font-medium'>
                  用户信息
                </label>
                <div className='mt-1 grid grid-cols-1 gap-3 md:grid-cols-2'>
                  {log.username && (
                    <div className='flex items-center gap-2 text-sm'>
                      <User className='h-4 w-4' />
                      <span>用户: {log.username}</span>
                    </div>
                  )}
                  {log.ip && (
                    <div className='flex items-center gap-2 text-sm'>
                      <Globe className='h-4 w-4' />
                      <span>IP: {log.ip}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* User Agent */}
            {log.userAgent && (
              <div>
                <label className='text-muted-foreground text-sm font-medium'>
                  User Agent
                </label>
                <div className='bg-muted mt-1 rounded-md p-3 text-xs break-all'>
                  {log.userAgent}
                </div>
              </div>
            )}

            {/* 详细信息 */}
            {log.details && (
              <div>
                <label className='text-muted-foreground text-sm font-medium'>
                  详细信息
                </label>
                <div className='bg-muted mt-1 rounded-md p-3'>
                  <pre className='max-h-64 overflow-auto text-xs'>
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
