'use client'

import { useEffect, useReducer, useState } from 'react'

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import {
  IconArrowLeft,
  IconBulb,
  IconPlayerPlay,
  IconRefresh,
} from '@tabler/icons-react'
import Link from 'next/link'

import { cn } from '~/lib/utils'

import { BIN_DETAILS, type BinColor, WASTE_ITEMS, type WasteItem } from './data'

import styles from './game.module.css'

type FallingWaste = { id: number; x: number; y: number } & WasteItem
type GameAction =
  | { bin: BinColor; id: number; type: 'sort' }
  | { deltaMs: number; pausedId: null | number; type: 'tick' }
  | { id: number; type: 'select' }
  | { type: 'spawn' }
  | { type: 'start' }
type GameState = {
  feedback: string
  items: FallingWaste[]
  level: number
  lives: number
  mistakes: Mistake[]
  nextId: number
  score: number
  selectedId: null | number
  status: GameStatus
}

type GameStatus = 'idle' | 'over' | 'playing'
type Mistake = {
  chosenBin: BinColor | null
  item: WasteItem
  reason: 'missed' | 'wrong-bin'
}

const INITIAL_STATE: GameState = {
  feedback: '',
  items: [],
  level: 1,
  lives: 3,
  mistakes: [],
  nextId: 1,
  score: 0,
  selectedId: null,
  status: 'idle',
}

const BIN_ICONS: Record<BinColor, string> = {
  blue: '🗑️',
  green: '🍃',
  red: '☣️',
  yellow: '♻️',
}

const WASTE_LANES = [4, 23, 42, 61, 80]

export function WasteSortGamePage() {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE)
  const [activeId, setActiveId] = useState<null | number>(null)
  const [bestScore, setBestScore] = useState(0)
  const [hoveredId, setHoveredId] = useState<null | number>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor)
  )

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    if (!event.over) return
    dispatch({
      bin: event.over.id as BinColor,
      id: Number(event.active.id),
      type: 'sort',
    })
  }

  function handleDragStart(event: DragStartEvent) {
    setHoveredId(null)
    setActiveId(Number(event.active.id))
  }

  function handleDragCancel() {
    setActiveId(null)
  }

  function handleBinClick(bin: BinColor) {
    if (state.selectedId !== null) {
      setHoveredId(null)
      dispatch({ bin, id: state.selectedId, type: 'sort' })
    }
  }

  function handleStart() {
    const stored = Number(
      window.localStorage.getItem('go-green-best-score') ?? 0
    )
    setBestScore(Number.isFinite(stored) ? stored : 0)
    dispatch({ type: 'start' })
  }

  useEffect(() => {
    if (state.status !== 'playing') return
    const tickTimer = window.setInterval(
      () =>
        dispatch({
          deltaMs: 80,
          pausedId: activeId ?? hoveredId,
          type: 'tick',
        }),
      80
    )
    return () => window.clearInterval(tickTimer)
  }, [activeId, hoveredId, state.status])

  useEffect(() => {
    if (state.status !== 'playing') return
    const spawnTimer = window.setInterval(
      () => dispatch({ type: 'spawn' }),
      Math.max(620, 1450 - state.level * 100)
    )
    dispatch({ type: 'spawn' })
    return () => window.clearInterval(spawnTimer)
  }, [state.level, state.status])

  useEffect(() => {
    if (state.status !== 'over' || state.score <= bestScore) return
    window.localStorage.setItem('go-green-best-score', String(state.score))
  }, [bestScore, state.score, state.status])

  const activeItem = state.items.find((item) => item.id === activeId)
  const selectedItem = state.items.find((item) => item.id === state.selectedId)

  return (
    <main className={styles.game}>
      <div aria-hidden="true" className={styles.sun} />
      <div aria-hidden="true" className={styles.cloud} />

      <Link aria-label="กลับหน้าค้นหาขยะ" className={styles.homeLink} href="/">
        <IconArrowLeft aria-hidden="true" />
      </Link>

      <div aria-label="สถานะเกม" className={styles.hud}>
        <div className={styles.hudItem}>
          คะแนน <span className={styles.hudValue}>{state.score}</span>
        </div>
        <div className={styles.hudItem}>
          เลเวล <span className={styles.hudValue}>{state.level}</span>
        </div>
        <div
          aria-label={`เหลือ ${state.lives} ชีวิต`}
          className={styles.hudItem}
        >
          {Array.from({ length: 3 }, (_, index) =>
            index < state.lives ? '❤️' : '🤍'
          ).join('')}
        </div>
      </div>

      {state.feedback && state.status === 'playing' ? (
        <div
          aria-live="polite"
          className={styles.feedback}
          key={`${state.feedback}-${state.items.length}`}
        >
          {state.feedback}
        </div>
      ) : null}

      {selectedItem ? (
        <div aria-live="polite" className={styles.sortPrompt}>
          เลือกถังให้ “{selectedItem.name}”
        </div>
      ) : null}

      <DndContext
        collisionDetection={pointerWithin}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}
      >
        <div className={styles.playfield}>
          {state.items.map((item) => (
            <DraggableWaste
              item={item}
              key={item.id}
              onHoverChange={(hovered) =>
                setHoveredId(hovered ? item.id : null)
              }
              onSelect={() => dispatch({ id: item.id, type: 'select' })}
              selected={state.selectedId === item.id}
            />
          ))}
        </div>

        <div className={styles.bins}>
          {(['red', 'green', 'blue', 'yellow'] as const).map((color) => (
            <DroppableBin
              color={color}
              highlighted={selectedItem !== undefined}
              key={color}
              onClick={() => handleBinClick(color)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeItem ? (
            <div className={cn(styles.waste, styles.dragOverlay)}>
              <WasteCard item={activeItem} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {state.status === 'idle' ? (
        <GameOverlay
          actionLabel="เริ่มเกม"
          icon={<IconPlayerPlay aria-hidden="true" />}
          onAction={handleStart}
          title="เกมแยกขยะ 4 สี"
        >
          <p className={styles.panelText}>
            ลากขยะลงถังให้ถูกสี หรือแตะขยะหนึ่งครั้งแล้วเลือกถัง
            ก่อนขยะตกถึงพื้น
          </p>
          <div className={styles.legend}>
            {(['red', 'green', 'blue', 'yellow'] as const).map((color) => (
              <div className={styles.legendItem} key={color}>
                <span className={cn(styles.legendDot, styles[color])}>
                  {BIN_ICONS[color]}
                </span>
                {BIN_DETAILS[color].label}
              </div>
            ))}
          </div>
        </GameOverlay>
      ) : null}

      {state.status === 'over' ? (
        <GameOverlay
          actionLabel="เล่นอีกครั้ง"
          icon={<IconRefresh aria-hidden="true" />}
          onAction={handleStart}
          title="จบเกม"
        >
          <div className={styles.finalScore}>{state.score}</div>
          <div className={styles.bestScore}>
            คะแนนสูงสุด: {Math.max(bestScore, state.score)}
          </div>
          <LearningSummary mistakes={state.mistakes} />
        </GameOverlay>
      ) : null}
    </main>
  )
}

function DraggableWaste({
  item,
  onHoverChange,
  onSelect,
  selected,
}: {
  item: FallingWaste
  onHoverChange: (hovered: boolean) => void
  onSelect: () => void
  selected: boolean
}) {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useDraggable({ id: item.id })
  return (
    <div
      className={styles.wastePosition}
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
      }}
    >
      <button
        {...attributes}
        {...listeners}
        aria-pressed={selected}
        className={styles.waste}
        data-dragging={isDragging}
        data-selected={selected}
        onClick={onSelect}
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
        ref={setNodeRef}
        style={{ transform: CSS.Translate.toString(transform) }}
        type="button"
      >
        <WasteCard item={item} />
      </button>
    </div>
  )
}

function DroppableBin({
  color,
  highlighted,
  onClick,
}: {
  color: BinColor
  highlighted: boolean
  onClick: () => void
}) {
  const { isOver, setNodeRef } = useDroppable({ id: color })
  const detail = BIN_DETAILS[color]
  return (
    <button
      aria-label={`ทิ้งลงถัง${detail.colorName} ${detail.description}`}
      className={styles.binButton}
      data-active={highlighted}
      data-over={isOver}
      onClick={onClick}
      ref={setNodeRef}
      type="button"
    >
      <span className={cn(styles.binBody, styles[color])}>
        <span className={styles.binLid} />
        <span aria-hidden="true" className={styles.binIcon}>
          {BIN_ICONS[color]}
        </span>
      </span>
      <span className={styles.binLabel}>
        ถัง{detail.colorName}
        <span className={styles.binDescription}>{detail.description}</span>
      </span>
    </button>
  )
}

function GameOverlay({
  actionLabel,
  children,
  icon,
  onAction,
  title,
}: {
  actionLabel: string
  children: React.ReactNode
  icon: React.ReactNode
  onAction: () => void
  title: string
}) {
  return (
    <div className={styles.overlay}>
      <section aria-modal="true" className={styles.panel} role="dialog">
        <h1 className={styles.panelTitle}>{title}</h1>
        {children}
        <button className={styles.startButton} onClick={onAction} type="button">
          {icon}
          {actionLabel}
        </button>
      </section>
    </div>
  )
}

function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'start') return { ...INITIAL_STATE, status: 'playing' }
  if (state.status !== 'playing') return state

  if (action.type === 'spawn') {
    if (state.items.length >= 6 || state.selectedId !== null) return state
    const item = WASTE_ITEMS[Math.floor(Math.random() * WASTE_ITEMS.length)]
    const lane = WASTE_LANES[(state.nextId - 1) % WASTE_LANES.length]
    return {
      ...state,
      items: [...state.items, { ...item, id: state.nextId, x: lane, y: -12 }],
      nextId: state.nextId + 1,
    }
  }

  if (action.type === 'select') {
    if (!state.items.some((item) => item.id === action.id)) return state
    return {
      ...state,
      selectedId: state.selectedId === action.id ? null : action.id,
    }
  }

  if (action.type === 'tick') {
    if (state.selectedId !== null) return state
    const distance = ((5.2 + state.level * 0.55) * action.deltaMs) / 1000
    const movedItems = state.items.map((item) =>
      item.id === action.pausedId || item.id === state.selectedId
        ? item
        : { ...item, y: item.y + distance }
    )
    const missed = movedItems.filter((item) => item.y >= 100)
    const lives = Math.max(0, state.lives - missed.length)
    return {
      ...state,
      feedback: missed.length ? 'พลาด! เสีย 1 ชีวิต' : state.feedback,
      items: lives === 0 ? [] : movedItems.filter((item) => item.y < 100),
      lives,
      mistakes: [
        ...state.mistakes,
        ...missed.map((item) => ({
          chosenBin: null,
          item,
          reason: 'missed' as const,
        })),
      ],
      selectedId: null,
      status: lives === 0 ? 'over' : state.status,
    }
  }

  const item = state.items.find((candidate) => candidate.id === action.id)
  if (!item) return state
  const correct = item.bin === action.bin
  const score = correct ? state.score + 10 : state.score
  const lives = correct ? state.lives : Math.max(0, state.lives - 1)

  return {
    ...state,
    feedback: correct
      ? 'ถูกต้อง +10'
      : `ยังไม่ใช่ ถัง${BIN_DETAILS[item.bin].colorName}`,
    items:
      lives === 0
        ? []
        : state.items.filter((candidate) => candidate.id !== action.id),
    level: Math.floor(score / 80) + 1,
    lives,
    mistakes: correct
      ? state.mistakes
      : [
          ...state.mistakes,
          { chosenBin: action.bin, item, reason: 'wrong-bin' },
        ],
    score,
    selectedId: null,
    status: lives === 0 ? 'over' : state.status,
  }
}

function LearningSummary({ mistakes }: { mistakes: Mistake[] }) {
  return (
    <section className={styles.learningSummary}>
      <div className={styles.learningHeading}>
        <IconBulb aria-hidden="true" />
        <div>
          <h2>ทบทวนก่อนเล่นรอบใหม่</h2>
          <p>จำสีถังของรายการเหล่านี้ไว้ รอบหน้าจะทำได้ดีขึ้น</p>
        </div>
      </div>
      <ul className={styles.mistakeList}>
        {mistakes.map((mistake, index) => {
          const correctBin = BIN_DETAILS[mistake.item.bin]
          const chosenBin = mistake.chosenBin
            ? BIN_DETAILS[mistake.chosenBin]
            : null

          return (
            <li
              className={styles.mistakeItem}
              key={`${mistake.item.name}-${index}`}
            >
              <span aria-hidden="true" className={styles.mistakeEmoji}>
                {mistake.item.emoji}
              </span>
              <div>
                <p className={styles.mistakeTitle}>{mistake.item.name}</p>
                <p className={styles.mistakeExplanation}>
                  {mistake.reason === 'missed'
                    ? 'ยังไม่ได้แยกก่อนตกถึงพื้น'
                    : `คุณเลือกถัง${chosenBin?.colorName}`}
                  {' แต่ควรลง'}
                  <strong>ถัง{correctBin.colorName}</strong> เพราะเป็นขยะ
                  {mistake.item.type}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function WasteCard({ item }: { item: WasteItem }) {
  return (
    <>
      <span aria-hidden="true" className={styles.wasteEmoji}>
        {item.emoji}
      </span>
      <span className={styles.wasteName}>{item.name}</span>
    </>
  )
}
