import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTour } from '../context/TourContext';
import { AnimatedOverlay } from './AnimatedOverlay';
import { AnimatedPopover } from './AnimatedPopover';
import type { MeasuredLayout, TourConfig } from '../types';

interface TourOverlayProps {
  config: TourConfig;
}

export function TourOverlay({ config }: TourOverlayProps) {
  const tour = useTour();
  const [highlightedLayout, setHighlightedLayout] = useState<MeasuredLayout | null>(null);

  useEffect(() => {
    if (tour.isActive && tour.currentStep?.ref?.current) {
      // Measure the highlighted component
      const ref = tour.currentStep.ref.current;

      // Delay measurement to allow for scrolling and layout
      const measureWithRetry = () => {
        ref.measureInWindow((x: number, y: number, width: number, height: number) => {
          // Check if element is measured properly (not at 0,0 with no dimensions)
          if (width > 0 && height > 0) {
            setHighlightedLayout({
              x,
              y,
              width,
              height,
              pageX: x,
              pageY: y,
            });
          } else {
            // Retry measurement after a short delay if dimensions are invalid
            setTimeout(measureWithRetry, 100);
          }
        });
      };

      // Initial delay to allow scroll animation to complete
      const timeoutId = setTimeout(measureWithRetry, 150);

      return () => clearTimeout(timeoutId);
    } else {
      setHighlightedLayout(null);
    }
  }, [tour.isActive, tour.currentStep, tour.currentStepIndex]);

  if (!tour.isActive || !tour.currentStep) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <AnimatedOverlay
        highlightedLayout={highlightedLayout}
        color={config.overlayColor}
        padding={tour.currentStep.padding}
        borderRadius={tour.currentStep.borderRadius}
        style={config.overlayStyle}
        onPress={config.allowClose !== false ? tour.stop : undefined}
        animationDuration={config.animationDuration}
      />
      <AnimatedPopover
        step={tour.currentStep}
        highlightedLayout={highlightedLayout}
        currentStep={tour.currentStepIndex + 1}
        totalSteps={tour.totalSteps}
        showButtons={config.showButtons}
        showProgress={config.showProgress}
        allowClose={config.allowClose}
        style={config.popoverStyle}
        onNext={tour.next}
        onPrevious={tour.previous}
        onClose={tour.stop}
        animationDuration={config.animationDuration}
      />
    </View>
  );
}
