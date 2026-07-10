'use client'

import { Fragment } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import { Separator } from '~/components/ui/separator'
import { SidebarTrigger } from '~/components/ui/sidebar'
import { navigationConfig } from '~/config/navigation'

type BreadcrumbCrumb = {
  href?: string
  label: string
}

export function SiteHeader() {
  const pathname = usePathname()
  const crumbs = getBreadcrumbs(pathname)

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          className="mx-2 data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1
              return (
                <Fragment key={crumb.label}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      crumb.href && (
                        <BreadcrumbLink render={<Link href={crumb.href} />}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}

function getBreadcrumbs(pathname: string): BreadcrumbCrumb[] {
  // Check main nav exact match
  const mainNavItem = navigationConfig.navMain.find(
    (item) => item.url === pathname
  )
  if (mainNavItem) return [{ label: mainNavItem.title }]

  // Check secondary nav exact match
  const secondaryNavItem = navigationConfig.navSecondary.find(
    (item) => item.url === pathname
  )
  if (secondaryNavItem) return [{ label: secondaryNavItem.title }]

  // Handle /:feature/:id dynamic routes automatically
  const dynamicRouteMatch = pathname.match(/^\/([^/]+)\/([^/]+)/)
  if (dynamicRouteMatch) {
    const featurePath = `/${dynamicRouteMatch[1]}`
    const id = dynamicRouteMatch[2]

    const parentNavItem =
      navigationConfig.navMain.find((item) => item.url === featurePath) ||
      navigationConfig.navSecondary.find((item) => item.url === featurePath)

    if (parentNavItem) {
      return [
        { href: parentNavItem.url, label: parentNavItem.title },
        { label: id },
      ]
    }
  }

  // Fallback
  return [{ label: 'Documents' }]
}
