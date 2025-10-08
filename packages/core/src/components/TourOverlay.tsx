import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTour } from '../context/TourContext';
import { Overlay } from './Overlay';
import { Popover } from './Popover';
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

      ref.measureInWindow((x: number, y: number, width: number, height: number) => {
        setHighlightedLayout({
          x,
          y,
          width,
          height,
          pageX: x,
          pageY: y,
        });
      });
    } else {
      setHighlightedLayout(null);
    }
  }, [tour.isActive, tour.currentStep, tour.currentStepIndex]);

  if (!tour.isActive || !tour.currentStep) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Overlay
        highlightedLayout={highlightedLayout}
        color={config.overlayColor}
        padding={tour.currentStep.padding}
        borderRadius={tour.currentStep.borderRadius}
        style={config.overlayStyle}
        onPress={config.allowClose !== false ? tour.stop : undefined}
      />
      <Popover
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
      />
    </View>
  );
}
