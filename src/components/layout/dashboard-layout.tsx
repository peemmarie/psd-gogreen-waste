import { AppSidebar } from '~/components/navigation/app-sidebar'
import { SiteHeader } from '~/components/navigation/site-header'
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
