# @sherpa/core

A lightweight, flexible, and dependency-free library for creating powerful, step-by-step guided product tours for your React Native applications.

Inspired by the amazing Driver.js, this library lets you highlight UI components to guide your users, improve the onboarding process, and showcase new features in an elegant and simple way.

## Features

- **Lightweight & Dependency-Free**: Built from the ground up with only React and React Native
- **Declarative API**: Define your tour steps in a simple array of objects
- **Fully Customizable**: Full control over the look and feel of the popover and overlay
- **Smooth Animations**: Support for fluid transitions between steps with Reanimated
- **Written in TypeScript**: Type-safe with autocompletion for a better developer experience

## Installation

```bash
npm install @sherpa/core react-native-reanimated
# or
yarn add @sherpa/core react-native-reanimated
```

### Setup Reanimated

Add the Reanimated plugin to your `babel.config.js`:

```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
```

> **Note**: The Reanimated plugin must be listed **last** in the plugins array.

## Quick Start

```tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  TourProvider,
  TourOverlay,
  useTour,
  useStepRef,
  type TourConfig,
} from '@sherpa/core';

function App() {
  const tourConfig: TourConfig = {
    steps: [
      {
        id: 'welcome',
        title: 'Welcome!',
        text: 'Let me show you around.',
        popoverPosition: 'center',
      },
      {
        id: 'button',
        title: 'Action Button',
        text: 'Tap this button to perform an action.',
        popoverPosition: 'bottom',
      },
    ],
    showButtons: true,
    showProgress: true,
    allowClose: true,
  };

  return (
    <TourProvider config={tourConfig}>
      <YourApp />
      <TourOverlay config={tourConfig} />
    </TourProvider>
  );
}

function YourApp() {
  const tour = useTour();
  const buttonRef = useStepRef();

  // Assign ref to step
  React.useEffect(() => {
    if (tour.currentStep?.id === 'button') {
      tour.currentStep.ref = buttonRef;
    }
  }, [tour.currentStep]);

  return (
    <View>
      <TouchableOpacity onPress={tour.start}>
        <Text>Start Tour</Text>
      </TouchableOpacity>

      <TouchableOpacity ref={buttonRef}>
        <Text>Important Button</Text>
      </TouchableOpacity>
    </View>
  );
}
```

## API Reference

### TourProvider

Wrap your app with `TourProvider` to enable tour functionality.

```tsx
<TourProvider config={tourConfig}>
  {/* Your app */}
</TourProvider>
```

### TourConfig

Configuration object for the tour:

```tsx
interface TourConfig {
  steps: TourStep[];
  showButtons?: boolean; // Default: true
  showProgress?: boolean; // Default: true
  allowClose?: boolean; // Default: true
  animate?: boolean; // Default: true - Requires react-native-reanimated
  animationDuration?: number; // Default: 300ms
  overlayColor?: string; // Default: 'rgba(0, 0, 0, 0.75)'
  popoverStyle?: ViewStyle;
  overlayStyle?: ViewStyle;
  onStart?: () => void;
  onComplete?: () => void;
  onSkip?: () => void;
}
```

### TourStep

Configuration for individual tour steps:

```tsx
interface TourStep {
  id: string;
  text: string;
  title?: string;
  ref?: React.RefObject<any>;
  popoverContent?: ReactNode;
  popoverPosition?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  onShow?: () => void;
  onHide?: () => void;
  padding?: number;
  borderRadius?: number;
}
```

### useTour Hook

Access tour controls and state:

```tsx
const {
  currentStepIndex,
  totalSteps,
  isActive,
  start,
  stop,
  next,
  previous,
  goToStep,
  currentStep,
} = useTour();
```

### useStepRef Hook

Create refs for components to highlight:

```tsx
const myComponentRef = useStepRef<View>();

<View ref={myComponentRef}>
  {/* Component to highlight */}
</View>
```

## Advanced Usage

### Custom Popover Content

```tsx
const tourConfig: TourConfig = {
  steps: [
    {
      id: 'custom',
      title: 'Custom Content',
      text: 'This won\'t be shown',
      popoverContent: (
        <View>
          <Text>Your custom JSX content here!</Text>
        </View>
      ),
    },
  ],
};
```

### Programmatic Control

```tsx
function MyComponent() {
  const tour = useTour();

  return (
    <View>
      <Button title="Start Tour" onPress={tour.start} />
      <Button title="Stop Tour" onPress={tour.stop} />
      <Button title="Next Step" onPress={tour.next} />
      <Button title="Previous Step" onPress={tour.previous} />
      <Button title="Go to Step 3" onPress={() => tour.goToStep(2)} />
    </View>
  );
}
```

### Step Callbacks

```tsx
const tourConfig: TourConfig = {
  steps: [
    {
      id: 'step1',
      title: 'Step 1',
      text: 'First step',
      onShow: () => console.log('Step 1 shown'),
      onHide: () => console.log('Step 1 hidden'),
    },
  ],
  onStart: () => console.log('Tour started'),
  onComplete: () => console.log('Tour completed'),
  onSkip: () => console.log('Tour skipped'),
};
```

### Animations

The library uses `react-native-reanimated` for smooth animations. Animations are enabled by default but can be disabled:

```tsx
const tourConfig: TourConfig = {
  steps: [...],
  animate: false, // Disable animations
};
```

You can also customize animation duration:

```tsx
const tourConfig: TourConfig = {
  steps: [...],
  animate: true,
  animationDuration: 500, // 500ms animations
};
```

The library provides both animated and non-animated components:
- `AnimatedOverlay` / `Overlay`
- `AnimatedPopover` / `Popover`

`TourOverlay` automatically switches between them based on the `animate` config option.

## Examples

Check out the [example app](../../apps/example) for a complete working demo.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
