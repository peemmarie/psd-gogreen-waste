# Migration Guide: Refactored Stepper Component

## Overview

The stepper component has been refactored from a monolithic implementation into a modular, reusable component system following the compound component pattern.

## What Changed

### Before (Monolithic)
```
form-container.tsx (117 lines)
├── All business logic mixed with UI
├── Hardcoded step icons
├── Tightly coupled to bill-buddy feature
└── Difficult to reuse in other contexts
```

### After (Modular)
```
components/data-display/stepper/
├── index.tsx          (Main container with compound pattern)
├── navigation.tsx     (Step indicators & progress UI)
├── content.tsx        (Content wrapper)
├── buttons.tsx        (Navigation buttons)
├── types.ts           (TypeScript definitions)
├── README.md          (Documentation)
└── MIGRATION.md       (This file)

containers/bill-buddy/
├── index.tsx          (Business logic & state management)
└── form-container.tsx (Presentation only, uses Stepper)
```

## Benefits

### 1. Separation of Concerns
- **Business Logic**: Lives in container components (`index.tsx`)
- **Presentation**: Pure UI components (`form-container.tsx`)
- **Reusable Components**: Generic stepper in `components/`

### 2. Reusability
The stepper can now be used in any multi-step form or workflow:
- Bill Buddy
- M-EV forms
- Solar Fit applications
- Any future multi-step feature

### 3. Flexibility
Each part can be customized independently:
- Custom icons via `getStepIcon`
- Custom button labels
- Conditional button states
- i18n support

### 4. Maintainability
- Clear component boundaries
- Type-safe with TypeScript
- Well-documented
- Easier to test

## Migration Example

### Old Implementation
```tsx
// Everything in one file
export const FormContainer = () => {
  const [activeStep, setActiveStep] = useState(0)
  const { getValues, setValue, trigger } = useFormContext()
  
  // Business logic mixed with UI
  const checkExistingMeter = async (ui, ca) => { ... }
  const checkFirstStep = async () => { ... }
  
  // Render everything inline
  return (
    <form>
      {/* Hardcoded stepper UI */}
      <div className="stepper">...</div>
      <div className="content">...</div>
      <div className="buttons">...</div>
    </form>
  )
}
```

### New Implementation

**Container (Business Logic)**
```tsx
// index.tsx - Business logic
export const BillBuddyContainer = () => {
  const [activeStep, setActiveStep] = useState(0)
  const form = useForm({ ... })
  
  const checkExistingMeter = async (ui, ca) => { ... }
  const handleNext = async () => { ... }
  const handlePrev = () => { ... }
  
  return (
    <Form {...form}>
      <FormContainer
        activeStep={activeStep}
        handleNext={handleNext}
        handlePrev={handlePrev}
        stepperSteps={stepperSteps}
      />
    </Form>
  )
}
```

**Presentation (UI)**
```tsx
// form-container.tsx - Pure presentation
export const FormContainer = ({
  activeStep,
  handleNext,
  handlePrev,
  stepperSteps,
}) => {
  const CurrentStepComponent = stepperSteps[activeStep].Component
  
  return (
    <Stepper {...props}>
      <Stepper.Navigation {...navigationProps} />
      <Stepper.Content>
        <CurrentStepComponent />
      </Stepper.Content>
      <Stepper.Buttons {...buttonProps} />
    </Stepper>
  )
}
```

## How to Use in New Features

```tsx
// 1. Define your steps
const steps = [
  { id: 'step1', title: 'Step 1', Component: Step1 },
  { id: 'step2', title: 'Step 2', Component: Step2 },
]

// 2. Manage state and logic
const [activeStep, setActiveStep] = useState(0)
const handleNext = () => setActiveStep(prev => prev + 1)
const handlePrev = () => setActiveStep(prev => prev - 1)

// 3. Render the stepper
<Stepper activeStep={activeStep} steps={steps} {...handlers}>
  <Stepper.Navigation activeStep={activeStep} steps={steps} />
  <Stepper.Content>
    <CurrentStepComponent />
  </Stepper.Content>
  <Stepper.Buttons {...buttonProps} />
</Stepper>
```

## Breaking Changes

### None for Existing Features
The bill-buddy implementation has been refactored internally but maintains the same external behavior. No user-facing changes.

### For New Implementations
If you were planning to copy the old stepper code:
- ✅ Use the new `Stepper` component instead
- ✅ See README.md for usage examples
- ✅ Follow the separation of concerns pattern

## Additional Features

### New Capabilities Added
1. **Custom Icons**: Pass `getStepIcon` function
2. **i18n Support**: Use `titleNamespace` prop
3. **Custom Labels**: Override button text
4. **Conditional States**: Control button disabled states
5. **Type Safety**: Full TypeScript support

### New Translation Namespace
Added `common.actions` for reusable button labels:
- `next`: "ต่อไป"
- `previous`: "ก่อนหน้า"
- Plus other common actions

## Questions?

See the main [README.md](./README.md) for comprehensive documentation and examples.

