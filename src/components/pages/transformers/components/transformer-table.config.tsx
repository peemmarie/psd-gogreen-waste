import { IconEdit, IconEye } from '@tabler/icons-react'
import Link from 'next/link'

import type { TableColumnDef } from '~/components/data-display/table'
import type { Transformer } from '~/types/transformer'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { formatDate } from '~/utils/date'

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

export function getTransformerTableColumns(): TableColumnDef<Transformer>[] {
  return [
    {
      accessorKey: 'stationId',
      cell: ({ row }) => (
        <span className="text-muted-foreground font-mono text-sm">
          {row.original.stationId}
        </span>
      ),
      header: 'Station ID',
      sortable: false,
      width: 100,
    },
    {
      accessorKey: 'id',
      cell: ({ row }) => (
        <span className="text-muted-foreground font-mono text-sm">
          {row.original.id}
        </span>
      ),
      header: 'Device ID',
      sortable: false,
      width: 120,
    },
    {
      accessorKey: 'serialNumber',
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.original.serialNumber || '—'}
        </span>
      ),
      header: 'MEA No.',
      sortable: false,
      width: 100,
    },
    {
      accessorKey: 'feeder',
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.feeder || '—'}</span>
      ),
      header: 'Feeder',
      sortable: false,
      width: 100,
    },
    {
      accessorKey: 'district',
      cell: ({ row }) => {
        const district = row.original.district
        return district ? `เขต${district}` : '-'
      },
      header: 'การไฟฟ้าเขต',
      sortDescFirst: true,
      sortKey: 'district',
      width: 140,
    },
    {
      accessorKey: 'capacity',
      align: 'right',
      cell: ({ row }) =>
        row.original.capacity > 0 ? row.original.capacity : '—',
      header: 'พิกัด (kVA)',
      sortable: true,
      sortDescFirst: true,
      sortKey: 'capacity',
      width: 110,
    },
    {
      accessorKey: 'installationType',
      cell: ({ row }) => row.original.installationType || '—',
      header: 'ประเภทติดตั้ง',
      sortDescFirst: true,
      sortKey: 'installationType',
      width: 120,
    },
    {
      accessorKey: 'ctRatio',
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.ctRatio || '—'}</span>
      ),
      header: 'อัตราส่วน CT',
      sortable: false,
      width: 100,
    },
    {
      accessorKey: 'tapChanger',
      align: 'center',
      cell: ({ row }) => <TapChangerBadge value={row.original.tapChanger} />,
      header: 'Tap Changer',
      sortable: true,
      sortDescFirst: true,
      sortKey: 'tap_changer',
      width: 130,
    },
    {
      accessorKey: 'status',
      align: 'center',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
      header: 'สถานะ',
      sortable: false,
      width: 80,
    },
    {
      accessorKey: 'installationDate',
      align: 'right',
      cell: ({ row }) => (
        <span className="text-muted-foreground tabular-nums">
          {row.original.installationDate
            ? formatDate(row.original.installationDate)
            : '—'}
        </span>
      ),
      header: 'วันที่ติดตั้ง TLM',
      sortDescFirst: true,
      sortKey: 'installation_date',
      width: 130,
    },
    {
      align: 'center',
      cell: ({ row }) => <ActionButtons transformer={row.original} />,
      header: 'จัดการ',
      id: 'view',
      sortable: false,
      width: 100,
    },
  ]
}

function ActionButtons({
  transformer,
}: Readonly<{ transformer: Transformer }>) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        aria-label="ดูรายละเอียด"
        className="text-muted-foreground hover:text-primary size-8 transition-colors"
        nativeButton={false}
        render={<Link href={`/transformers/${transformer.stationId}`} />}
        size="icon-sm"
        title="ดูรายละเอียด"
        variant="ghost"
      >
        <IconEye aria-hidden="true" />
      </Button>
      <Button
        aria-label="แก้ไขข้อมูล"
        className="text-muted-foreground hover:text-primary size-8 transition-colors"
        disabled
        size="icon-sm"
        title="แก้ไขข้อมูล"
        variant="ghost"
      >
        <IconEdit aria-hidden="true" />
      </Button>
    </div>
  )
}

function StatusBadge({ status }: Readonly<{ status: Transformer['status'] }>) {
  const isOnline = status === 'online'

  return (
    <Badge
      className={
        isOnline
          ? 'bg-green-500 text-white capitalize hover:bg-green-600'
          : 'bg-red-500 text-white capitalize hover:bg-red-600'
      }
    >
      {isOnline ? 'Online' : 'Offline'}
    </Badge>
  )
}

function TapChangerBadge({ value }: Readonly<{ value: string }>) {
  const isOltc = value === 'oltc'

  return (
    <Badge
      className={
        isOltc
          ? 'bg-blue-500 text-white hover:bg-blue-600'
          : 'bg-muted text-muted-foreground hover:bg-muted'
      }
    >
      {isOltc ? 'OLTC' : 'Manual'}
    </Badge>
  )
}
