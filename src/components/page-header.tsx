import type { ReactNode } from 'react'

import { IconArrowLeft } from '@tabler/icons-react'

import { Button } from '~/components/ui/button'

type PageHeaderProps = {
  backHref?: string
  children?: ReactNode
  className?: string
  description?: ReactNode | string
  onClick?: () => void
  title: ReactNode | string
}

export function PageHeader({
  // className,
  children,
  description,
  onClick,
  title,
}: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        {onClick && (
          <Button
            className="mt-1"
            nativeButton
            onClick={onClick}
            size="icon"
            variant="outline"
          >
            <IconArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-200">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
      </div>
      {children && <div>{children}</div>}
    </div>
  )
}
