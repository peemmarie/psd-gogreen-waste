'use client'

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'

type ActiveLabel = number | string
type BrushSelection = { end: ActiveLabel; start: ActiveLabel }
type BrushState = BrushSelection | null
type BrushStateWithWindow = { dataWindowKey: string } & BrushSelection
type ChartEvent = { activeLabel?: ActiveLabel }
type ZoomDomain = null | ZoomSelection
type ZoomDomainWithWindow = { dataWindowKey: string } & ZoomSelection
type ZoomSelection = { endIndex: number; startIndex: number }

export function useChartZoom(data: Record<string, unknown>[]) {
  const [zoomDomainState, setZoomDomainState] =
    useState<null | ZoomDomainWithWindow>(null)
  const [brushStateState, setBrushStateState] =
    useState<BrushStateWithWindow | null>(null)
  const brushStateRef = useRef<BrushState>(null)
  const isMouseDownRef = useRef(false)

  const totalPoints = data.length
  const lastPoint = data[totalPoints - 1] as Record<string, unknown> | undefined
  const firstPoint = data[0] as Record<string, unknown> | undefined
  const dataWindowKey = `${totalPoints}:${getPointId(firstPoint)}:${getPointId(lastPoint)}`
  const zoomDomain: ZoomDomain =
    zoomDomainState?.dataWindowKey === dataWindowKey ? zoomDomainState : null
  const brushState: BrushState =
    brushStateState?.dataWindowKey === dataWindowKey ? brushStateState : null

  const maxIndex = Math.max(0, totalPoints - 1)
  const startIndex = zoomDomain ? Math.min(zoomDomain.startIndex, maxIndex) : 0
  const endIndex = zoomDomain
    ? Math.min(zoomDomain.endIndex, maxIndex)
    : totalPoints - 1
  const visibleCount =
    totalPoints === 0 ? 0 : Math.max(0, endIndex - startIndex + 1)

  const isZoomed = zoomDomain !== null

  const handleZoomIn = useCallback(() => {
    const quarter = Math.max(1, Math.floor(visibleCount * 0.25))
    const newStart = Math.min(startIndex + quarter, endIndex - 1)
    const newEnd = Math.max(endIndex - quarter, newStart + 1)
    setZoomDomainState({
      dataWindowKey,
      endIndex: newEnd,
      startIndex: newStart,
    })
  }, [startIndex, endIndex, visibleCount, dataWindowKey])

  const handleZoomOut = useCallback(() => {
    if (!isZoomed) return
    const quarter = Math.max(1, Math.floor(visibleCount * 0.25))
    const newStart = Math.max(0, startIndex - quarter)
    const newEnd = Math.min(totalPoints - 1, endIndex + quarter)
    const fullyReset = newStart === 0 && newEnd === totalPoints - 1
    setZoomDomainState(
      fullyReset
        ? null
        : {
            dataWindowKey,
            endIndex: newEnd,
            startIndex: newStart,
          }
    )
  }, [startIndex, endIndex, visibleCount, totalPoints, isZoomed, dataWindowKey])

  const handleReset = useCallback(() => {
    setZoomDomainState(null)
    setBrushStateState(null)
  }, [])

  const handleMouseDown = useCallback(
    (e: ChartEvent) => {
      isMouseDownRef.current = true
      const activeLabel = e.activeLabel

      if (activeLabel !== undefined) {
        setBrushStateState({
          dataWindowKey,
          end: activeLabel,
          start: activeLabel,
        })
      }
    },
    [dataWindowKey]
  )

  const handleMouseMove = useCallback(
    (e: ChartEvent) => {
      const activeLabel = e.activeLabel

      if (!isMouseDownRef.current || activeLabel === undefined) return
      setBrushStateState((prev) => ({
        dataWindowKey,
        end: activeLabel,
        start: prev?.dataWindowKey === dataWindowKey ? prev.start : activeLabel,
      }))
    },
    [dataWindowKey]
  )

  const handleMouseUp = useCallback(() => {
    isMouseDownRef.current = false
    const bs = brushStateRef.current
    setBrushStateState(null)

    if (!bs || bs.start === bs.end) return

    const i1 = data.findIndex(
      (d) => getPointId(d as Record<string, unknown>) === String(bs.start)
    )
    const i2 = data.findIndex(
      (d) => getPointId(d as Record<string, unknown>) === String(bs.end)
    )
    const newStart = Math.max(0, Math.min(i1, i2))
    const newEnd = Math.min(totalPoints - 1, Math.max(i1, i2))

    if (newEnd > newStart) {
      setZoomDomainState({
        dataWindowKey,
        endIndex: newEnd,
        startIndex: newStart,
      })
    }
  }, [data, totalPoints, dataWindowKey])

  const visibleData = useMemo(
    () => data.slice(startIndex, endIndex + 1),
    [data, startIndex, endIndex]
  )

  useLayoutEffect(() => {
    brushStateRef.current = brushState
  })

  return {
    brushState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleReset,
    handleZoomIn,
    handleZoomOut,
    isZoomed,
    totalPoints,
    visibleCount,
    visibleData,
  }
}

function getPointId(point: Record<string, unknown> | undefined) {
  if (!point) return ''
  return String(point.timestamp ?? point.time ?? '')
}
