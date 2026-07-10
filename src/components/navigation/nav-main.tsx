'use client'

import { useState } from 'react'

import { ChevronRight, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '~/components/ui/sidebar'

type NavCollapsibleItemProps = Readonly<{
  icon?: LucideIcon
  items: { title: string; url: string }[]
  title: string
  url: string
}>

type NavMainProps = Readonly<{
  items: {
    icon?: LucideIcon
    items?: { title: string; url: string }[]
    title: string
    url: string
  }[]
}>

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname()

  function isActive(url: string) {
    return url === '#'
      ? false
      : pathname === url || pathname?.startsWith(url + '/')
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarGroupLabel>รายการเมนู</SidebarGroupLabel>
        <SidebarMenu>
          {items.map(({ icon: Icon, items: subItems, title, url }) => {
            if (subItems && subItems.length > 0) {
              return (
                <NavCollapsibleItem
                  icon={Icon}
                  items={subItems}
                  key={title}
                  title={title}
                  url={url}
                />
              )
            }

            return (
              <SidebarMenuItem key={title}>
                <SidebarMenuButton
                  isActive={isActive(url)}
                  render={
                    <Link href={url}>
                      {Icon && <Icon />}
                      <span>{title}</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function NavCollapsibleItem({
  icon: Icon,
  items: subItems,
  title,
  url,
}: NavCollapsibleItemProps) {
  const pathname = usePathname()

  const defaultOpen = isActive(url) || subItems.some((s) => isActive(s.url))
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [prevPathname, setPrevPathname] = useState(pathname)

  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    if (isActive(url) || subItems.some((s) => isActive(s.url))) {
      setIsOpen(true)
    }
  }

  function isActive(u: string) {
    return u === '#' ? false : pathname === u || pathname?.startsWith(u + '/')
  }

  return (
    <Collapsible
      className="group/collapsible"
      onOpenChange={setIsOpen}
      open={isOpen}
    >
      <SidebarMenuItem>
        <CollapsibleTrigger
          render={
            <SidebarMenuButton
              isActive={isActive(url) || subItems.some((s) => isActive(s.url))}
              tooltip={title}
            >
              {Icon && <Icon />}
              <span>{title}</span>
              <ChevronRight className="group-data-open/collapsible:rotate-90` ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          }
        />
        <CollapsibleContent>
          <SidebarMenuSub>
            {subItems.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  isActive={isActive(subItem.url)}
                  render={
                    <Link href={subItem.url}>
                      <span>{subItem.title}</span>
                    </Link>
                  }
                />
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}
