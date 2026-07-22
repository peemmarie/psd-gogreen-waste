'use client'

import { type ReactNode, useState } from 'react'

import { IconArrowRight, IconLeaf, IconMenu2, IconX } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '~/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

          <div className="hidden items-center justify-end gap-2 md:flex">
            <Button
              className="bg-[#5df591] px-5 font-bold text-[#111111] hover:bg-[#49db7b]"
              nativeButton={false}
              render={<Link href="/game/waste-sort" />}
            >
              เริ่มเล่น
              <IconArrowRight data-icon="inline-end" />
            </Button>
          </div>

          <Sheet onOpenChange={setIsMobileMenuOpen} open={isMobileMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  aria-label="เปิดเมนูหลัก"
                  className="border-[#111111] bg-white font-bold text-[#111111] shadow-none hover:bg-[#f7f8f3] md:hidden"
                  variant="outline"
                />
              }
            >
              <IconMenu2 aria-hidden="true" data-icon="inline-start" />
              เมนู
            </SheetTrigger>

            <SheetContent
              className="w-[min(88vw,22rem)] gap-0 border-l-2 border-[#111111] bg-[#f7f8f3] p-0 sm:max-w-[22rem]"
              showCloseButton={false}
              side="right"
            >
              <SheetHeader className="relative gap-3 border-b-2 border-[#111111] bg-white p-5 pr-16 text-left">
                <div className="flex items-center gap-3">
                  <span className="rounded-base flex size-10 items-center justify-center bg-[#111111] text-[#5df591]">
                    <IconLeaf aria-hidden="true" />
                  </span>
                  <span className="font-bold">PSD GreenHub</span>
                </div>
                <SheetTitle className="text-2xl text-[#111111]">
                  ไปที่ไหนต่อดี?
                </SheetTitle>
                <SheetDescription className="text-[#4d5053]">
                  เลือกเรียนรู้ ค้นหาวิธีแยกขยะ หรือเริ่มภารกิจสีเขียว
                </SheetDescription>
                <SheetClose asChild>
                  <Button
                    aria-label="ปิดเมนูหลัก"
                    className="absolute top-4 right-4 border-[#111111] bg-white text-[#111111] shadow-none hover:bg-[#f7f8f3]"
                    size="icon"
                    variant="outline"
                  >
                    <IconX aria-hidden="true" data-icon="inline-start" />
                  </Button>
                </SheetClose>
              </SheetHeader>

              <nav
                aria-label="เมนูหลักบนมือถือ"
                className="flex flex-1 flex-col gap-3 overflow-y-auto p-5"
              >
                {NAVIGATION_ITEMS.map((item) => {
                  const isActive = isNavigationActive(item.href)

                  return (
                    <Link
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'neo-flat flex min-h-12 items-center justify-between bg-white px-4 py-3 font-bold text-[#111111] transition-[background-color,transform,box-shadow] hover:bg-[#e8f2df] focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 focus-visible:outline-none',
                        isActive && 'bg-[#5df591] shadow-[4px_4px_0_0_#111111]'
                      )}
                      href={item.href}
                      key={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>{item.label}</span>
                      <IconArrowRight aria-hidden="true" />
                    </Link>
                  )
                })}
              </nav>

              <div className="border-t-2 border-[#111111] bg-white p-5">
                <Button
                  className="h-12 w-full bg-[#5df591] text-base font-bold text-[#111111] hover:bg-[#49db7b]"
                  nativeButton={false}
                  onClick={() => setIsMobileMenuOpen(false)}
                  render={<Link href="/game/waste-sort" />}
                >
                  เริ่มเกมแยกขยะ 4 สี
                  <IconArrowRight data-icon="inline-end" />
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {children}
    </main>
  )
}
