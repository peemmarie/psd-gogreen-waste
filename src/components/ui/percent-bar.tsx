type PercentBarProps = {
  /** Show 0% / 100% end labels. Defaults to true. */
  showLabels?: boolean
  /** Thresholds for color transitions. Defaults: warn at 70, danger at 90. */
  thresholds?: { danger: number; warn: number }
  /** Value in percent (0–100). Automatically clamped. */
  value: number
}

/**
 * A horizontal progress bar that fills to `value` percent and changes
 * color based on configurable warn / danger thresholds.
 *
 * - ≤ warn  → emerald (green)
 * - warn–danger → amber (yellow)
 * - > danger   → red
 */
export function PercentBar({
  showLabels = true,
  thresholds = { danger: 90, warn: 70 },
  value,
}: PercentBarProps) {
  const pct = Math.min(100, Math.max(0, value))

  const color =
    pct > thresholds.danger
      ? 'bg-red-500'
      : pct > thresholds.warn
        ? 'bg-amber-400'
        : 'bg-emerald-500'

  return (
    <div className="space-y-1">
      <div className="bg-muted rounded-base h-2 w-full overflow-hidden">
        <div
          className={`rounded-base h-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabels && (
        <div className="text-muted-foreground flex justify-between text-[10px]">
          <span>0%</span>
          <span>100%</span>
        </div>
      )}
    </div>
  )
}
