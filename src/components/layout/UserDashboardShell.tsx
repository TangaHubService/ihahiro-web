'use client'

import { DashboardShell } from '@/components/layout/DashboardShell'
import { useUserDashboardNavItems } from '@/hooks/useUserDashboardNavItems'

export function UserDashboardShell({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const navItems = useUserDashboardNavItems()

  return (
    <DashboardShell title={title} navItems={navItems}>
      {children}
    </DashboardShell>
  )
}
