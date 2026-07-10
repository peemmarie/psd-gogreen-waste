import { DashboardLayout } from '~/components/layout/dashboard-layout'

type LayoutProps = {
  children: React.ReactNode
}

export default function PrivateLayout({ children }: Readonly<LayoutProps>) {
  return <DashboardLayout>{children}</DashboardLayout>
}
