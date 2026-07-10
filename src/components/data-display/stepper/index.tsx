import { useEffect } from 'react'

import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'

import type { StepButtonsProps, StepContentProps, StepperProps } from './types'
import type { StepNavigationProps } from './types'

import { Button } from '~/components/ui/button'

export function Stepper({ children, onKeyDown }: StepperProps) {
  useEffect(() => {
    if (!onKeyDown) return
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onKeyDown])

  return <form className="flex h-full flex-col">{children}</form>
}

function StepButtons({
  activeStep,
  nextDisabled,
  nextLabel,
  onNext,
  onPrevious,
  previousDisabled,
  previousLabel,
  stepsLength,
}: StepButtonsProps) {
  const t = useTranslations('common.actions')

  const isPreviousDisabled = previousDisabled ?? activeStep === 0
  const isNextDisabled = nextDisabled ?? activeStep === stepsLength - 1

  return (
    <div className="bg-background flex justify-between border-t p-6 pb-0">
      <Button
        disabled={isPreviousDisabled}
        onClick={onPrevious}
        type="button"
        variant="secondary"
      >
        {previousLabel ?? t('previous')}
      </Button>
      <Button disabled={isNextDisabled} onClick={onNext} type="button">
        {nextLabel ?? t('next')}
      </Button>
    </div>
  )
}

function StepContent({ children }: StepContentProps) {
  return <div className="mb-6 flex-1 overflow-auto">{children}</div>
}

function StepNavigation({
  activeStep,
  getStepIcon,
  steps,
  titleNamespace,
}: StepNavigationProps) {
  const t = useTranslations(titleNamespace)
  const lastStepIndex = steps.length - 1

  function renderStepIcon(step: (typeof steps)[number], index: number) {
    const isCompleted = activeStep > index

    if (getStepIcon) return getStepIcon(step.id, isCompleted)

    if (isCompleted) return <Check className="size-5" />

    return (
      step.icon || <span className="text-sm font-semibold">{index + 1}</span>
    )
  }

  return (
    <div className="px-40 py-6">
      <div className="flex w-full items-center">
        {steps.map((step, index) => (
          <div
            className="flex items-center"
            key={step.id}
            style={{
              flex: index === lastStepIndex ? '0 0 auto' : '1',
            }}
          >
            <div className="flex flex-col items-center">
              <div
                className={`flex size-12 items-center justify-center rounded-full border-2 shadow-sm transition-all duration-200 ${
                  activeStep === index
                    ? 'border-primary bg-primary text-primary-foreground shadow-lg'
                    : activeStep > index
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-muted-foreground/20 bg-muted text-muted-foreground'
                }`}
              >
                {renderStepIcon(step, index)}
              </div>
              <div className="mt-2">
                <p
                  className={`text-center text-sm font-semibold transition-colors duration-200 ${
                    activeStep === index
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {titleNamespace ? t(step.title) : step.title}
                </p>
              </div>
            </div>
            {index < lastStepIndex && (
              <div
                className={`mx-6 h-0.5 flex-1 transition-colors duration-200 ${
                  activeStep > index ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

Stepper.Navigation = StepNavigation
Stepper.Content = StepContent
Stepper.Buttons = StepButtons

export type {
  StepButtonsProps,
  StepConfig,
  StepContentProps,
  StepNavigationProps,
  StepperProps,
} from './types'
