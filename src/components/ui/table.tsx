import * as React from 'react'

import { cn } from '~/lib/utils'

function Table({
  className,
  wrapperClassName,
  ...props
}: {
  wrapperClassName?: string
} & React.ComponentProps<'table'>) {
  return (
    <div className={cn('relative w-full overflow-auto', wrapperClassName)}>
      <table
        className={cn(
          'border-border w-full caption-bottom border-2 text-sm',
          className
        )}
        data-slot="table"
        {...props}
      />
    </div>
  )
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      className={cn('[&_tr:last-child]:border-0', className)}
      data-slot="table-body"
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<'caption'>) {
  return (
    <caption
      className={cn('text-foreground font-base mt-4 text-sm', className)}
      data-slot="table-caption"
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      className={cn(
        'p-4 align-middle [&:has([role=checkbox])]:pr-0',
        className
      )}
      data-slot="table-cell"
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      className={cn(
        'border-border bg-main font-base text-main-foreground border-t-2 last:[&>tr]:border-b-0',
        className
      )}
      data-slot="table-footer"
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      className={cn(
        'font-heading text-main-foreground h-12 px-4 text-left align-middle [&:has([role=checkbox])]:pr-0',
        className
      )}
      data-slot="table-head"
      {...props}
    />
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      className={cn('[&_tr]:border-border [&_tr]:border-b-2', className)}
      data-slot="table-header"
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      className={cn(
        'border-border text-main-foreground bg-main font-base data-[state=selected]:bg-secondary-background data-[state=selected]:text-main-foreground border-b-2 transition-colors',
        className
      )}
      data-slot="table-row"
      {...props}
    />
  )
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
}
