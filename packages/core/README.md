# rn-sherpa

A lightweight, flexible, and dependency-free library for creating powerful, step-by-step guided product tours for your React Native applications.

Inspired by the amazing Driver.js, this library lets you highlight UI components to guide your users, improve the onboarding process, and showcase new features in an elegant and simple way.

## Features

- **Lightweight & Dependency-Free**: Built from the ground up with only React and React Native
- **Declarative API**: Define your tour steps in a simple array of objects
- **Fully Customizable**: Full control over the look and feel of the popover and overlay
- **Smooth Animations**: Support for fluid transitions between steps with Reanimated
- **Smart Positioning**: Automatically adjusts popover position to stay visible on screen
- **Scroll-to-View**: Automatically scrolls elements into view when tour steps change
- **Written in TypeScript**: Type-safe with autocompletion for a better developer experience

## Installation

```bash
npm install rn-sherpa react-native-reanimated
# or
yarn add rn-sherpa react-native-reanimated
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

Here's a simple example to get you started:

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  TourProvider,
  TourOverlay,
  useTour,
  useStepRef,
  useAutoScroll,
  type TourConfig,
} from 'rn-sherpa';

function App() {
  const tourConfig: TourConfig = {
    steps: [
      {
        id: 'welcome',
        title: 'Welcome! 🎉',
        text: 'Let me show you around this app.',
        popoverPosition: 'center',
      },
      {
        id: 'header',
        title: 'App Header',
        text: 'This is your main navigation area.',
        popoverPosition: 'bottom',
        padding: 12,
        borderRadius: 12,
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
    animationDuration: 400,
    overlayColor: 'rgba(0, 0, 0, 0.75)',
  };

  return (
    <TourProvider config={tourConfig}>
      <SafeAreaProvider>
        <YourApp />
        <TourOverlay config={tourConfig} />
      </SafeAreaProvider>
    </TourProvider>
  );
}

function YourApp() {
  const tour = useTour();
  const scrollViewRef = React.useRef<ScrollView>(null);

  // Create refs for tour steps
  const headerRef = useStepRef<View>();
  const buttonRef = useStepRef<View>();

  // Automatically scroll to elements during tour
  useAutoScroll(scrollViewRef);

  // Assign refs to tour steps
  React.useEffect(() => {
    if (tour.currentStep) {
      switch (tour.currentStep.id) {
        case 'header':
          tour.currentStep.ref = headerRef;
          break;
        case 'button':
          tour.currentStep.ref = buttonRef;
          break;
      }
    }
  }, [tour.currentStep, headerRef, buttonRef]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView ref={scrollViewRef}>
        <View ref={headerRef} style={{ padding: 20, backgroundColor: '#007AFF' }}>
          <Text style={{ color: 'white', fontSize: 24 }}>My App</Text>
        </View>

        <TouchableOpacity
          onPress={tour.start}
          style={{ padding: 16, backgroundColor: '#28a745', margin: 20 }}
        >
          <Text style={{ color: 'white' }}>Start Tour</Text>
        </TouchableOpacity>

        <TouchableOpacity
          ref={buttonRef}
          style={{ padding: 16, backgroundColor: '#007AFF', margin: 20 }}
        >
          <Text style={{ color: 'white' }}>Important Button</Text>
        </TouchableOpacity>
      </ScrollView>
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
  // Required
  steps: TourStep[];

  // UI Options
  showButtons?: boolean;          // Show navigation buttons (default: true)
  showProgress?: boolean;         // Show "X of Y" progress indicator (default: true)
  allowClose?: boolean;           // Allow closing tour with X button (default: true)

  // Animation
  animationDuration?: number;     // Animation duration in ms (default: 300)

  // Styling
  overlayColor?: string;          // Overlay color (default: 'rgba(0, 0, 0, 0.75)')
  popoverStyle?: ViewStyle;       // Custom styles for popover
  overlayStyle?: ViewStyle;       // Custom styles for overlay

  // Callbacks
  onStart?: () => void;           // Called when tour starts
  onComplete?: () => void;        // Called when tour completes normally
  onSkip?: () => void;            // Called when tour is closed/skipped
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

### useAutoScroll Hook

Automatically scrolls to tour elements in ScrollView:

```tsx
const scrollViewRef = useRef<ScrollView>(null);

// Basic usage
useAutoScroll(scrollViewRef);

// With options
useAutoScroll(scrollViewRef, {
  topPadding: 150,    // Padding from top (default: 100)
  animated: true,     // Animate scroll (default: true)
  enabled: true,      // Enable/disable (default: true)
});

<ScrollView ref={scrollViewRef}>
  {/* Your content */}
</ScrollView>
```

## Key Features Explained

### Smart Positioning

The library automatically adjusts popover positions to ensure they're always visible on screen. When you specify a `popoverPosition`, the library:

1. **Checks available space** in all directions
2. **Automatically switches position** if there's insufficient space
3. **Maintains proper spacing** from screen edges

Example:
```tsx
{
  id: 'bottom-button',
  title: 'Settings',
  text: 'Access your settings here.',
  popoverPosition: 'bottom', // Will auto-switch to 'top' if near bottom of screen
}
```

**How it works:**
- If you choose `bottom` but there's less than 240px space below → switches to `top`
- If you choose `top` but there's less than 240px space above → switches to `bottom`
- Same logic applies for `left` ↔ `right`
- Animations automatically match the actual calculated position

### Auto-Scroll to Elements

For scrollable content, you can implement auto-scrolling to ensure tour elements are visible:

```tsx
function YourApp() {
  const tour = useTour();
  const scrollViewRef = React.useRef<ScrollView>(null);

  // Auto-scroll when tour step changes
  React.useEffect(() => {
    if (tour.isActive && tour.currentStep?.ref?.current && scrollViewRef.current) {
      const ref = tour.currentStep.ref.current;

      ref.measureLayout(
        scrollViewRef.current as any,
        (_x: number, y: number, _width: number, height: number) => {
          scrollViewRef.current?.scrollTo({
            y: Math.max(0, y - 100), // 100px padding from top
            animated: true,
          });
        },
        (error) => console.log('Measurement failed:', error)
      );
    }
  }, [tour.isActive, tour.currentStep, tour.currentStepIndex]);

  return (
    <ScrollView ref={scrollViewRef}>
      {/* Your content */}
    </ScrollView>
  );
}
```

**Best Practices:**
- Always add padding when scrolling (e.g., `y - 100`) to avoid elements at screen edges
- Use `animated: true` for smooth scrolling transitions
- The library includes measurement retry logic to handle elements that need time to render

### Spotlight Customization

Customize the spotlight cutout around highlighted elements:

```tsx
{
  id: 'custom-spotlight',
  title: 'Custom Highlight',
  text: 'Notice the rounded corners and extra padding.',
  padding: 16,        // Extra space around element (default: 8)
  borderRadius: 20,   // Corner radius for spotlight (default: 8)
}
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

### Animation Customization

The library uses `react-native-reanimated` for smooth, performant animations:

```tsx
const tourConfig: TourConfig = {
  steps: [...],
  animationDuration: 500, // Customize animation speed (default: 300ms)
};
```

**Built-in Animations:**
- **Overlay**: Fade in/out with spotlight cutout animation
- **Popover**: Position-aware slide animations
  - `top` position → Slides in from top
  - `bottom` position → Slides in from bottom
  - `left` position → Slides in from left
  - `right` position → Slides in from right
  - `center` position → Fades in
- **Scale effect**: Subtle scale animation (0.9 → 1.0) on popovers

The animations automatically adapt to the actual calculated position, so if smart positioning switches from `bottom` to `top`, the animation will also switch to match.

## Troubleshooting

### Popover appears off-screen

**Solution:** The library includes smart positioning that automatically adjusts placement. If this still happens:

1. Ensure elements have proper dimensions when measured
2. Add a small delay before starting the tour to allow layout to complete:
   ```tsx
   setTimeout(() => tour.start(), 100);
   ```

### Element not highlighting correctly

**Solution:** Elements need to be measured before highlighting. The library includes automatic retry logic, but you can help by:

1. Ensuring the element is rendered before the tour step activates
2. Using `onShow` callback to verify the element is ready:
   ```tsx
   {
     id: 'step1',
     title: 'Step 1',
     text: 'Content',
     onShow: () => console.log('Step showing - element should be rendered'),
   }
   ```

### Scrollable content: Element not scrolling into view

**Solution:** Implement the auto-scroll pattern shown in the "Auto-Scroll to Elements" section above. The library handles measurement timing, but you need to provide the scroll logic.

### Animation issues

**Problem:** Animations stuttering or not working

**Solution:**
1. Ensure `react-native-reanimated` is properly installed
2. Verify babel plugin is added and listed **last** in `babel.config.js`
3. Rebuild your app after adding the Reanimated plugin
4. For iOS: run `pod install` in the ios folder

### TypeScript errors

**Problem:** Type errors with refs or config

**Solution:**
1. Import types from the library:
   ```tsx
   import type { TourConfig, TourStep } from 'rn-sherpa';
   ```
2. Use generic type parameters with `useStepRef`:
   ```tsx
   const myRef = useStepRef<View>();
   ```

## Best Practices

### 1. Tour Step Organization

Structure your tour steps from top to bottom, following the natural reading order:

```tsx
const tourConfig: TourConfig = {
  steps: [
    { id: 'welcome', popoverPosition: 'center' },    // Start with welcome
    { id: 'header', popoverPosition: 'bottom' },     // Then top elements
    { id: 'content', popoverPosition: 'top' },       // Middle elements
    { id: 'footer', popoverPosition: 'top' },        // Bottom elements
  ],
};
```

### 2. Position Selection

Choose positions that make sense for each element's location:

- **Top elements** (header, navbar): Use `popoverPosition: 'bottom'`
- **Bottom elements** (footer, tabs): Use `popoverPosition: 'top'`
- **Side elements**: Use `left` or `right` based on screen position
- **Introductory/concluding steps**: Use `center` for full-screen focus

The smart positioning system will auto-adjust if needed!

### 3. Implement Scroll-to-View

Always implement scroll-to-view for scrollable content to ensure great UX:

```tsx
React.useEffect(() => {
  if (tour.isActive && tour.currentStep?.ref?.current && scrollViewRef.current) {
    // Scroll implementation here
  }
}, [tour.isActive, tour.currentStep, tour.currentStepIndex]);
```

### 4. Use Callbacks Wisely

Leverage callbacks for analytics, state management, or triggering actions:

```tsx
const tourConfig: TourConfig = {
  steps: [
    {
      id: 'feature',
      title: 'New Feature',
      text: 'Check this out!',
      onShow: () => {
        // Track step view
        analytics.track('tour_step_viewed', { step: 'feature' });
      },
    },
  ],
  onComplete: () => {
    // Mark tour as completed
    AsyncStorage.setItem('tour_completed', 'true');
  },
};
```

### 5. Customize Spotlight for Context

Adjust padding and border radius based on the element type:

```tsx
// Large padding for small buttons
{ id: 'small-icon', padding: 16, borderRadius: 20 }

// Minimal padding for large cards
{ id: 'card', padding: 8, borderRadius: 12 }
```

### 6. SafeAreaProvider Integration

Always wrap your app with `SafeAreaProvider` to handle notches and safe areas correctly:

```tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';

<TourProvider config={tourConfig}>
  <SafeAreaProvider>
    <YourApp />
  </SafeAreaProvider>
  <TourOverlay config={tourConfig} />
</TourProvider>
```

### 7. Test on Multiple Devices

The smart positioning system works across different screen sizes, but always test:

- Small screens (iPhone SE)
- Large screens (iPad, large Android phones)
- Different orientations (if supported)

## Examples

Check out the [example app](../../apps/example) for a complete working demo.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
