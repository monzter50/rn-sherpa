import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import type { MeasuredLayout, TourStep } from '../types';

interface PopoverProps {
  /**
   * Current step configuration
   */
  step: TourStep;

  /**
   * Layout of the highlighted component
   */
  highlightedLayout?: MeasuredLayout | null;

  /**
   * Current step index (1-based for display)
   */
  currentStep: number;

  /**
   * Total number of steps
   */
  totalSteps: number;

  /**
   * Whether to show navigation buttons
   */
  showButtons?: boolean;

  /**
   * Whether to show progress indicator
   */
  showProgress?: boolean;

  /**
   * Whether to allow closing the tour
   */
  allowClose?: boolean;

  /**
   * Custom popover style
   */
  style?: ViewStyle;

  /**
   * Callback for next button
   */
  onNext?: () => void;

  /**
   * Callback for previous button
   */
  onPrevious?: () => void;

  /**
   * Callback for close button
   */
  onClose?: () => void;
}

export function Popover({
  step,
  highlightedLayout,
  currentStep,
  totalSteps,
  showButtons = true,
  showProgress = true,
  allowClose = true,
  style,
  onNext,
  onPrevious,
  onClose,
}: PopoverProps) {
  const position = calculatePopoverPosition(highlightedLayout, step.popoverPosition);

  return (
    <View style={[styles.container, position, style]} pointerEvents="box-none">
      <View style={styles.popover}>
        {/* Header */}
        <View style={styles.header}>
          {step.title && <Text style={styles.title}>{step.title}</Text>}
          {allowClose && (
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Content */}
        {step.popoverContent ? (
          step.popoverContent
        ) : (
          <Text style={styles.text}>{step.text}</Text>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          {showProgress && (
            <Text style={styles.progress}>
              {currentStep} of {totalSteps}
            </Text>
          )}

          {showButtons && (
            <View style={styles.buttonGroup}>
              {currentStep > 1 && (
                <Pressable style={styles.button} onPress={onPrevious}>
                  <Text style={styles.buttonText}>Previous</Text>
                </Pressable>
              )}
              <Pressable
                style={[styles.button, styles.primaryButton]}
                onPress={onNext}
              >
                <Text style={[styles.buttonText, styles.primaryButtonText]}>
                  {currentStep === totalSteps ? 'Done' : 'Next'}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

function calculatePopoverPosition(
  layout: MeasuredLayout | null | undefined,
  preferredPosition?: 'top' | 'bottom' | 'left' | 'right' | 'center'
): ViewStyle {
  if (!layout) {
    // Center on screen
    return {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -150 }, { translateY: -100 }],
    };
  }

  const { pageX, pageY, width, height } = layout;
  const position = preferredPosition || 'bottom';

  const POPOVER_WIDTH = 300;
  const SPACING = 16;

  switch (position) {
    case 'top':
      return {
        position: 'absolute',
        bottom: `${100 - (pageY / 812) * 100}%`,
        left: pageX + width / 2 - POPOVER_WIDTH / 2,
        marginBottom: SPACING,
      };

    case 'bottom':
      return {
        position: 'absolute',
        top: pageY + height + SPACING,
        left: pageX + width / 2 - POPOVER_WIDTH / 2,
      };

    case 'left':
      return {
        position: 'absolute',
        top: pageY + height / 2 - 100,
        right: `${100 - (pageX / 375) * 100}%`,
        marginRight: SPACING,
      };

    case 'right':
      return {
        position: 'absolute',
        top: pageY + height / 2 - 100,
        left: pageX + width + SPACING,
      };

    case 'center':
      return {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -150 }, { translateY: -100 }],
      };

    default:
      return {
        position: 'absolute',
        top: pageY + height + SPACING,
        left: pageX + width / 2 - POPOVER_WIDTH / 2,
      };
  }
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1001,
  },
  popover: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progress: {
    fontSize: 12,
    color: '#666',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  primaryButtonText: {
    color: 'white',
  },
});
