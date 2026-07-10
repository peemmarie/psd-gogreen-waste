# Stepper Component

A flexible and reusable stepper component for multi-step forms and workflows.

## Features

- **Modular Architecture**: Composed of `Navigation`, `Content`, and `Buttons` sub-components
- **Flexible Styling**: Customizable icons and step indicators
- **i18n Support**: Built-in translation support
- **Type-Safe**: Full TypeScript support
- **Compound Component Pattern**: Easy to compose and customize

## Architecture

The stepper consists of 4 main parts:

1. **`index.tsx`** - Main container component
2. **`navigation.tsx`** - Step indicator UI with progress visualization
3. **`content.tsx`** - Content wrapper for each step
4. **`buttons.tsx`** - Navigation buttons (Previous/Next)

## Basic Usage

```tsx
import { Stepper } from '@/components/data-display/stepper'

const MyForm = () => {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    { id: 'step1', title: 'First Step', Component: Step1Component },
    { id: 'step2', title: 'Second Step', Component: Step2Component },
    { id: 'step3', title: 'Third Step', Component: Step3Component },
  ]

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1)
    }
  }

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const CurrentStepComponent = steps[activeStep].Component

  return (
    <Stepper
      activeStep={activeStep}
      onNext={handleNext}
      onPrevious={handlePrevious}
      steps={steps}
    >
      <Stepper.Navigation activeStep={activeStep} steps={steps} />
      
      <Stepper.Content>
        <CurrentStepComponent />
      </Stepper.Content>
      
      <Stepper.Buttons
        activeStep={activeStep}
        onNext={handleNext}
        onPrevious={handlePrevious}
        stepsLength={steps.length}
      />
    </Stepper>
  )
}
```

## Advanced Usage

### Custom Icons

You can customize icons for each step:

```tsx
import { Search, FileText, Check } from 'lucide-react'

const getStepIcon = (stepId: string, isCompleted: boolean) => {
  if (isCompleted) return <Check className="size-5" />

  switch (stepId) {
    case 'step1':
      return <Search className="size-5" />
    case 'step2':
      return <FileText className="size-5" />
    default:
      return null
  }
}

<Stepper.Navigation
  activeStep={activeStep}
  steps={steps}
  getStepIcon={getStepIcon}
/>
```

### With i18n

Enable translations for step titles:

```tsx
<Stepper.Navigation
  activeStep={activeStep}
  steps={steps}
  titleNamespace="pages.my_form"  // Will translate step.title using this namespace
/>
```

### Custom Button Labels

```tsx
<Stepper.Buttons
  activeStep={activeStep}
  onNext={handleNext}
  onPrevious={handlePrevious}
  stepsLength={steps.length}
  previousLabel="Go Back"
  nextLabel="Continue"
/>
```

### Conditional Button States

```tsx
const [isValid, setIsValid] = useState(false)

<Stepper.Buttons
  activeStep={activeStep}
  onNext={handleNext}
  onPrevious={handlePrevious}
  stepsLength={steps.length}
  nextDisabled={!isValid}  // Disable next until valid
/>
```

### With Form Validation

```tsx
const handleNext = async () => {
  // Validate current step
  const isValid = await validateStep(activeStep)
  
  if (isValid && activeStep < steps.length - 1) {
    setActiveStep(activeStep + 1)
  }
}

const handlePrevious = () => {
  if (activeStep > 0) {
    setActiveStep(activeStep - 1)
  }
}
```

## Component Props

### Stepper

| Prop | Type | Description |
|------|------|-------------|
| `activeStep` | `number` | Current active step index |
| `children` | `ReactNode` | Child components (Navigation, Content, Buttons) |
| `onNext` | `() => void` | Handler for next action |
| `onPrevious` | `() => void` | Handler for previous action |
| `steps` | `readonly StepConfig[]` | Array of step configurations |

### Stepper.Navigation

| Prop | Type | Description |
|------|------|-------------|
| `activeStep` | `number` | Current active step index |
| `steps` | `readonly StepConfig[]` | Array of step configurations |
| `getStepIcon?` | `(stepId: string, isCompleted: boolean) => ReactNode` | Custom icon renderer |
| `titleNamespace?` | `string` | i18n namespace for translating titles |

### Stepper.Content

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Step content to render |

### Stepper.Buttons

| Prop | Type | Description |
|------|------|-------------|
| `activeStep` | `number` | Current active step index |
| `stepsLength` | `number` | Total number of steps |
| `onNext` | `() => void` | Handler for next button |
| `onPrevious` | `() => void` | Handler for previous button |
| `nextLabel?` | `string` | Custom label for next button |
| `previousLabel?` | `string` | Custom label for previous button |
| `nextDisabled?` | `boolean` | Override next button disabled state |
| `previousDisabled?` | `boolean` | Override previous button disabled state |

### StepConfig

```typescript
type StepConfig = {
  id: string              // Unique step identifier
  title: string           // Step title (translatable)
  Component: React.ComponentType  // Component to render for this step
  icon?: ReactNode        // Optional custom icon
}
```

## Examples

See the implementation in `src/containers/bill-buddy/` for a complete example with:

- Form validation
- API calls
- Multi-step form with react-hook-form
- Custom icons
- i18n integration

## Styling

The stepper uses Tailwind CSS classes and follows the design system's theme. Key style features:

- **Active step**: Primary color with shadow
- **Completed steps**: Primary color with reduced opacity
- **Inactive steps**: Muted colors
- **Smooth transitions**: 200ms duration on color changes
- **Responsive padding**: px-40 py-6 for navigation

## Best Practices

1. **Keep step components focused**: Each step should handle one logical section
2. **Validate before proceeding**: Always validate the current step before moving to the next
3. **Provide clear feedback**: Use icons and colors to indicate progress
4. **Handle errors gracefully**: Show validation errors and prevent navigation when invalid
5. **Use meaningful step IDs**: Makes debugging and tracking easier
6. **Leverage TypeScript**: Take advantage of type safety for step configurations
