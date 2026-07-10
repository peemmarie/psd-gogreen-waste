import {
  ArrowUpDownIcon,
  Cancel01Icon,
  Search01Icon,
  SortByDown02Icon,
  SortByUp02Icon,
  Tick01Icon,
  ZapIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { IconMapPin } from '@tabler/icons-react'

export type MapStatusFilter = 'all' | 'offline' | 'online'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { cn } from '~/lib/utils'

export type SortOption = 'id-asc' | 'id-desc' | 'nearest' | 'status'

type MapFilterPanelProps = {
  districts: string[]
  filterDistrict: string
  filterStatus: MapStatusFilter
  onClose?: () => void
  onFilterDistrictChange: (district: null | string) => void
  onFilterStatusChange: (status: MapStatusFilter) => void
  onSearchChange: (query: string) => void
  onSortChange: (sort: SortOption) => void
  searchQuery: string
  sortBy: SortOption
  totalCount: number
}

export function MapFilterPanel({
  districts,
  filterDistrict,
  filterStatus,
  onClose,
  onFilterDistrictChange,
  onFilterStatusChange,
  onSearchChange,
  onSortChange,
  searchQuery,
  sortBy,
  totalCount,
}: MapFilterPanelProps) {
  const sortByLabel =
    {
      'id-asc': 'รหัส (A-Z)',
      'id-desc': 'รหัส (Z-A)',
      nearest: 'ใกล้ฉันที่สุด',
      status: 'สถานะ (ออนไลน์ก่อน)',
    }[sortBy] || 'เรียงตาม...'

  const statusLabel =
    {
      all: 'ทุกสถานะ',
      offline: 'ออฟไลน์',
      online: 'ออนไลน์',
    }[filterStatus] || 'สถานะ'

  const statusIcon = {
    all: (
      <span className="flex size-4 items-center justify-center rounded-full bg-blue-500/15">
        <span className="size-1.5 rounded-full bg-blue-500" />
      </span>
    ),
    offline: (
      <span className="flex size-4 items-center justify-center rounded-full bg-red-500/15">
        <span className="size-1.5 rounded-full bg-red-500" />
      </span>
    ),
    online: (
      <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500/15">
        <span className="size-1.5 rounded-full bg-emerald-500" />
      </span>
    ),
  }[filterStatus] || (
    <span className="flex size-4 items-center justify-center rounded-full bg-blue-500/15">
      <span className="size-1.5 rounded-full bg-blue-500" />
    </span>
  )

  return (
    <div className="bg-background/85 sm:border-border/50 flex flex-col gap-5 rounded-2xl border border-white/20 p-5 shadow-2xl backdrop-blur-xl dark:border-white/10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h2 className="text-base font-bold tracking-tight">
            ค้นหา & จัดการหม้อแปลง
          </h2>
          <p className="text-muted-foreground mt-0.5 text-xs font-medium">
            แสดง {totalCount} รายการในแผนที่
          </p>
        </div>
        {onClose && (
          <Button
            className="text-muted-foreground hover:bg-muted/50 hover:text-foreground -mt-1 -mr-2 size-8 rounded-full"
            onClick={onClose}
            size="icon"
            variant="ghost"
          >
            <HugeiconsIcon className="size-4" icon={Cancel01Icon} />
          </Button>
        )}
      </div>

      {/* Main Form Area */}
      <div className="flex flex-col gap-3">
        {/* Search */}
        <div className="relative">
          <HugeiconsIcon
            className="text-foreground/70 absolute top-1/2 left-3 size-4 -translate-y-1/2"
            icon={Search01Icon}
          />
          <Input
            className={cn(
              'border-border/50 bg-card/60 focus-visible:ring-primary h-10 rounded-xl pl-9 shadow-xs backdrop-blur-md transition-colors focus-visible:ring-1',
              searchQuery && 'pr-9'
            )}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาตามรหัส, หมายเลข..."
            value={searchQuery}
          />
          {searchQuery && (
            <Button
              className="hover:bg-accent/50 text-foreground/80 hover:text-foreground absolute top-1/2 right-1 size-8 -translate-y-1/2 rounded-lg"
              onClick={() => onSearchChange('')}
              size="icon"
              variant="ghost"
            >
              <HugeiconsIcon
                className="text-foreground/80 size-3.5"
                icon={Cancel01Icon}
              />
            </Button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 gap-2">
          <Select
            onValueChange={(val) =>
              onFilterDistrictChange(val === 'all' ? null : val)
            }
            value={filterDistrict}
          >
            <SelectTrigger className="border-border/50 bg-card/60 hover:bg-accent/50 h-10 rounded-xl shadow-xs backdrop-blur-md transition-colors">
              <div className="flex items-center gap-2 text-sm font-medium">
                <IconMapPin className="text-primary size-4" />
                <SelectValue placeholder="พื้นที่ทั้งหมด">
                  {filterDistrict === 'all' || !filterDistrict
                    ? 'พื้นที่ทั้งหมด'
                    : filterDistrict}
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent className="border-border/50 max-h-[300px] rounded-xl p-1.5 shadow-lg">
              <SelectItem className="cursor-pointer rounded-md" value="all">
                พื้นที่ทั้งหมด
              </SelectItem>
              {districts.map((d) => (
                <SelectItem
                  className="cursor-pointer rounded-md"
                  key={d}
                  value={d}
                >
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger
              render={
                <Button
                  className="border-border/50 bg-card/60 hover:bg-accent/50 h-10 w-full justify-start rounded-xl border px-3 font-medium shadow-xs backdrop-blur-md transition-colors"
                  variant="ghost"
                />
              }
            >
              <div className="flex items-center gap-2 text-sm">
                {statusIcon}
                <span className="truncate">{statusLabel}</span>
              </div>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="border-border/50 w-56 rounded-xl p-3 shadow-xl"
            >
              <div className="space-y-3">
                <div className="space-y-1">
                  <h4 className="text-sm leading-none font-medium">
                    แสดงสถานะ
                  </h4>
                  <p className="text-muted-foreground text-xs">
                    เลือกสถานะที่ต้องการแสดง
                  </p>
                </div>
                <div className="space-y-1.5">
                  <button
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-2.5 rounded-lg border p-2 text-left text-sm font-medium transition-colors',
                      filterStatus === 'all'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'hover:bg-accent border-transparent bg-transparent'
                    )}
                    onClick={() => onFilterStatusChange('all')}
                    type="button"
                  >
                    <span className="flex size-4 items-center justify-center rounded-full bg-blue-500/15">
                      <span className="size-1.5 rounded-full bg-blue-500" />
                    </span>
                    <span className="flex-1">ทั้งหมด ({totalCount})</span>
                  </button>
                  <button
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-2.5 rounded-lg border p-2 text-left text-sm font-medium transition-colors',
                      filterStatus === 'online'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'hover:bg-accent border-transparent bg-transparent'
                    )}
                    onClick={() => onFilterStatusChange('online')}
                    type="button"
                  >
                    <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500/15">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                    </span>
                    <span className="flex-1">ออนไลน์ ({totalCount})</span>
                  </button>
                  <button
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-2.5 rounded-lg border p-2 text-left text-sm font-medium transition-colors',
                      filterStatus === 'offline'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'hover:bg-accent border-transparent bg-transparent'
                    )}
                    onClick={() => onFilterStatusChange('offline')}
                    type="button"
                  >
                    <span className="flex size-4 items-center justify-center rounded-full bg-red-500/15">
                      <span className="size-1.5 rounded-full bg-red-500" />
                    </span>
                    <span className="flex-1">ออฟไลน์ ({totalCount})</span>
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Sort Row */}
        <div className="border-border/50 mt-1 flex items-center justify-between border-t pt-3">
          <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
            <HugeiconsIcon className="size-3.5" icon={ArrowUpDownIcon} />
            จัดเรียงตาม
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  className="hover:bg-accent/50 text-foreground h-7 cursor-pointer gap-1.5 rounded-lg px-2 text-xs font-medium"
                  variant="ghost"
                />
              }
            >
              {sortByLabel}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border-border/50 w-48 rounded-xl p-1.5 shadow-xl"
            >
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="focus:bg-accent/50 cursor-pointer gap-2 rounded-md text-xs font-medium"
                  onClick={() => onSortChange('id-asc')}
                >
                  <HugeiconsIcon
                    className="text-muted-foreground size-3.5"
                    icon={SortByDown02Icon}
                  />
                  <span className="flex-1">ID (A-Z)</span>
                  {sortBy === 'id-asc' && (
                    <HugeiconsIcon
                      className="text-primary size-3.5"
                      icon={Tick01Icon}
                    />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="focus:bg-accent/50 cursor-pointer gap-2 rounded-md text-xs font-medium"
                  onClick={() => onSortChange('id-desc')}
                >
                  <HugeiconsIcon
                    className="text-muted-foreground size-3.5"
                    icon={SortByUp02Icon}
                  />
                  <span className="flex-1">ID (Z-A)</span>
                  {sortBy === 'id-desc' && (
                    <HugeiconsIcon
                      className="text-primary size-3.5"
                      icon={Tick01Icon}
                    />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="focus:bg-accent/50 cursor-pointer gap-2 rounded-md text-xs font-medium"
                  onClick={() => onSortChange('status')}
                >
                  <HugeiconsIcon
                    className="text-muted-foreground size-3.5"
                    icon={ZapIcon}
                  />
                  <span className="flex-1">สถานะ (Online First)</span>
                  {sortBy === 'status' && (
                    <HugeiconsIcon
                      className="text-primary size-3.5"
                      icon={Tick01Icon}
                    />
                  )}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
