'use client'

import type { ReactNode } from 'react'

import {
  IconLayoutRows,
  IconMap2,
  IconSwitchHorizontal,
  IconTable,
} from '@tabler/icons-react'

import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

export type TransformerLayoutMode = 'split' | 'toggle'
export type TransformerToggleView = 'map' | 'table'

type TransformerMonitorWorkspaceProps = Readonly<{
  activeView: TransformerToggleView
  layoutMode: TransformerLayoutMode
  map: ReactNode
  onViewChange: (view: TransformerToggleView) => void
  table: ReactNode
}>

type TransformerViewControlsProps = Readonly<{
  layoutMode: TransformerLayoutMode
  onLayoutChange: (mode: TransformerLayoutMode) => void
}>

export function TransformerMonitorWorkspace({
  activeView,
  layoutMode,
  map,
  onViewChange,
  table,
}: TransformerMonitorWorkspaceProps) {
  const showMap = layoutMode === 'split' || activeView === 'map'
  const showTable = layoutMode === 'split' || activeView === 'table'

  return (
    <section aria-label="พื้นที่ติดตามหม้อแปลง" className="space-y-3">
      {layoutMode === 'toggle' && (
        <div className="bg-muted/40 inline-flex rounded-lg border p-1">
          <ViewButton
            active={activeView === 'map'}
            icon={<IconMap2 aria-hidden="true" className="size-4" />}
            label="แผนที่"
            onClick={() => onViewChange('map')}
          />
          <ViewButton
            active={activeView === 'table'}
            icon={<IconTable aria-hidden="true" className="size-4" />}
            label="ตาราง"
            onClick={() => onViewChange('table')}
          />
        </div>
      )}

      <div
        className={cn(
          'grid min-h-0 gap-3',
          layoutMode === 'split' && 'grid-rows-[380px_auto]'
        )}
      >
        {showMap && (
          <div
            className={cn(
              'bg-card overflow-hidden',
              layoutMode === 'split' ? 'h-full' : 'h-130'
            )}
          >
            {map}
          </div>
        )}
        {showTable && (
          <div className="bg-card min-w-0 overflow-hidden rounded-xl border shadow-sm">
            {table}
          </div>
        )}
      </div>
    </section>
  )
}

export function TransformerViewControls({
  layoutMode,
  onLayoutChange,
}: TransformerViewControlsProps) {
  return (
    <fieldset
      aria-label="เลือกรูปแบบการแสดงผล"
      className="bg-muted/40 flex items-center gap-1 rounded-lg border p-1"
      role="group"
    >
      <span className="text-muted-foreground hidden px-2 text-[10px] font-semibold tracking-wider uppercase sm:inline">
        มุมมอง
      </span>
      <ViewButton
        active={layoutMode === 'split'}
        icon={<IconLayoutRows aria-hidden="true" className="size-4" />}
        label="Split"
        onClick={() => onLayoutChange('split')}
      />
      <ViewButton
        active={layoutMode === 'toggle'}
        icon={<IconSwitchHorizontal aria-hidden="true" className="size-4" />}
        label="Toggle"
        onClick={() => onLayoutChange('toggle')}
      />
    </fieldset>
  )
}

function ViewButton({
  active,
  icon,
  label,
  onClick,
}: Readonly<{
  active: boolean
  icon: ReactNode
  label: string
  onClick: () => void
}>) {
  return (
    <Button
      aria-pressed={active}
      className={cn(
        'h-8 gap-1.5 px-3 text-xs shadow-none',
        active && 'bg-primary text-primary-foreground hover:bg-primary/90'
      )}
      onClick={onClick}
      size="sm"
      type="button"
      variant={active ? 'default' : 'ghost'}
    >
      {icon}
      {label}
    </Button>
  )
}
