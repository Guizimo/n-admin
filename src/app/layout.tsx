import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { auth } from '@/lib/auth';
import Providers from '@/contexts/providers';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `${siteConfig.name} - 让后台先理解，再执行`,
  description: siteConfig.description,
  keywords: ['AI Native', '管理后台', 'RBAC', 'Next.js', '开源'],
  openGraph: {
    title: `${siteConfig.name} - AI Native 管理操作系统`,
    description: siteConfig.description,
    type: 'website'
  }
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang='zh-CN' suppressHydrationWarning>
      <body className='antialiased'>
        <NuqsAdapter>
          <Providers session={session}>
            <Toaster />
            {children}
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
