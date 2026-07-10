import type { ReactNode } from 'react'

export type StepButtonsProps = {
  activeStep: number
  nextDisabled?: boolean
  nextLabel?: string
  onNext: () => void
  onPrevious: () => void
  previousDisabled?: boolean
  previousLabel?: string
  stepsLength: number
}

export type StepConfig = {
  Component: React.ComponentType
  icon?: ReactNode
  id: string
  title: string
}

export type StepContentProps = {
  children: ReactNode
}

export type StepNavigationProps = {
  activeStep: number
  getStepIcon?: (stepId: string, isCompleted: boolean) => ReactNode
  steps: readonly StepConfig[]
  titleNamespace?: string
}

export type StepperProps = {
  activeStep: number
  children: ReactNode
  onKeyDown?: (event: KeyboardEvent) => void
  onNext: () => void
  onPrevious: () => void
  steps: readonly StepConfig[]
}
