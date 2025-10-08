import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { TourConfig, TourContextValue, TourStep } from '../types';

const TourContext = createContext<TourContextValue | undefined>(undefined);

interface TourProviderProps {
  children: React.ReactNode;
  config: TourConfig;
}

export function TourProvider({ children, config }: TourProviderProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const totalSteps = config.steps.length;
  const currentStep = isActive && currentStepIndex < totalSteps
    ? config.steps[currentStepIndex]
    : null;

  const start = useCallback(() => {
    setIsActive(true);
    setCurrentStepIndex(0);
    config.onStart?.();
    config.steps[0]?.onShow?.();
  }, [config]);

  const stop = useCallback(() => {
    currentStep?.onHide?.();
    setIsActive(false);
    setCurrentStepIndex(0);
    config.onSkip?.();
  }, [config, currentStep]);

  const next = useCallback(() => {
    if (currentStepIndex < totalSteps - 1) {
      currentStep?.onHide?.();
      setCurrentStepIndex((prev) => prev + 1);
      config.steps[currentStepIndex + 1]?.onShow?.();
    } else {
      // Tour completed
      currentStep?.onHide?.();
      setIsActive(false);
      setCurrentStepIndex(0);
      config.onComplete?.();
    }
  }, [currentStepIndex, totalSteps, config, currentStep]);

  const previous = useCallback(() => {
    if (currentStepIndex > 0) {
      currentStep?.onHide?.();
      setCurrentStepIndex((prev) => prev - 1);
      config.steps[currentStepIndex - 1]?.onShow?.();
    }
  }, [currentStepIndex, config, currentStep]);

  const goToStep = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSteps) {
        currentStep?.onHide?.();
        setCurrentStepIndex(index);
        config.steps[index]?.onShow?.();
      }
    },
    [totalSteps, config, currentStep]
  );

  const value = useMemo<TourContextValue>(
    () => ({
      currentStepIndex,
      totalSteps,
      isActive,
      start,
      stop,
      next,
      previous,
      goToStep,
      currentStep,
    }),
    [currentStepIndex, totalSteps, isActive, start, stop, next, previous, goToStep, currentStep]
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}
