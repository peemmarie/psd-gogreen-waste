'use client'

import type { ReactNode } from 'react'

import { IconArrowRight, IconLeaf } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

type WasteSortPageShellProps = {
  children: ReactNode
}

const NAVIGATION_ITEMS = [
  { href: '/learning', label: 'เรียนรู้' },
  { href: '/search', label: 'ค้นหาถัง' },
  { href: '/waste-route', label: 'เส้นทางขยะ' },
  { href: '/game', label: 'เกมทั้งหมด' },
]

export function WasteSortPageShell({ children }: WasteSortPageShellProps) {
  const pathname = usePathname()

  function isNavigationActive(href: string) {
    if (href === '/learning') {
      return pathname === '/' || pathname.startsWith('/learning')
    }

    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <main className="min-h-dvh scroll-pt-24 overflow-x-hidden bg-[#f7f8f3] pt-[73px] text-[#111111]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#eceee7] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link className="flex items-center gap-3 text-lg font-bold" href="/">
            <span className="rounded-base flex size-10 items-center justify-center bg-[#111111] text-[#5df591]">
              <IconLeaf aria-hidden="true" />
            </span>
            <span>PSD GreenHub</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-[#4d5053] md:flex">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = isNavigationActive(item.href)

              return (
                <Link
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'relative isolate px-1 py-1 text-[#4d5053] transition-colors hover:text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5df591]',
                    isActive && 'font-bold text-[#111111]'
                  )}
                  href={item.href}
                  key={item.href}
                >
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-[0.18em] z-0 h-[0.58em] bg-[#5df591]"
                    />
                  ) : null}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center justify-end gap-2">
            <Button
              className="bg-[#5df591] px-5 font-bold text-[#111111] hover:bg-[#49db7b]"
              nativeButton={false}
              render={<Link href="/game/waste-sort" />}
            >
              เริ่มเล่น
              <IconArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </header>

      {children}
    </main>
  )
}
