import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';

export const metadata: Metadata = {
  title: 'N Admin',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        {/* page main content */}
        {children}
        {/* page main content ends */}
      </SidebarInset>
    </SidebarProvider>
  );
}
