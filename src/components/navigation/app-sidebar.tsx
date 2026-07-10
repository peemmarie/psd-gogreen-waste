'use client'

import * as React from 'react'

import Image from 'next/image'

import tlmLogo from '~/assets/images/logo.png'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from '~/components/ui/sidebar'
import { navigationConfig } from '~/config/navigation'

import { NavMain } from './nav-main'
// import { NavSecondary } from './nav-secondary'
import { NavUser } from './nav-user'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu className="flex items-center justify-center">
          <Image
            alt="Logo"
            className="object-contain mix-blend-multiply"
            height={64}
            src={tlmLogo}
            unoptimized
            width={128}
          />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationConfig.navMain} />
        {/* <NavDocuments items={navigationConfig.documents} /> */}
        {/* <NavSecondary
          className="mt-auto"
          items={navigationConfig.navSecondary}
        /> */}
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={navigationConfig.user} />
      </SidebarFooter> */}
    </Sidebar>
  )
}
