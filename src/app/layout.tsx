import type { Metadata } from 'next'

import { Suspense } from 'react'

import { NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { ibmSans } from '~/lib'
import { TanstackProvider, ToasterProvider } from '~/providers'

import './globals.css'

const TITLE = 'Go Green'

export const metadata: Metadata = {
  description: TITLE,
  icons: {
    icon: '/favicon.ico',
  },
  title: {
    default: TITLE,
    template: `%s | ${TITLE}`,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  return (
    <html lang={locale || 'th'}>
      <body
        className={`${ibmSans.variable} ${ibmSans.className} antialiased`}
        suppressHydrationWarning
      >
        <TanstackProvider>
          <NextIntlClientProvider>
            <NuqsAdapter>
              <Suspense>{children}</Suspense>
            </NuqsAdapter>
          </NextIntlClientProvider>
          <ToasterProvider />
        </TanstackProvider>
      </body>
    </html>
  )
}
