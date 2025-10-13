import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  interpolate,
  Extrapolate,
  SlideInDown,
  SlideInUp,
  SlideInLeft,
  SlideInRight,
  FadeIn,
} from 'react-native-reanimated';
import type { ViewStyle, TextStyle } from 'react-native';
import type { MeasuredLayout, TourStep } from '../types';

interface AnimatedPopoverProps {
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

  /**
   * Animation duration in milliseconds
   */
  animationDuration?: number;
}

export function AnimatedPopover({
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
  animationDuration = 300,
}: AnimatedPopoverProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const { width: screenWidth } = Dimensions.get('window');

  useEffect(() => {
    scale.value = 0;
    opacity.value = 0;

    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
    opacity.value = withTiming(1, { duration: animationDuration });
  }, [currentStep, animationDuration]);

  const { position, actualPosition } = calculatePopoverPosition(
    highlightedLayout,
    step.popoverPosition,
    screenWidth
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {
        scale: interpolate(
          scale.value,
          [0, 1],
          [0.9, 1],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  const getEnteringAnimation = () => {
    // Use the actual calculated position for animation, not the preferred one
    const animationPosition = actualPosition || step.popoverPosition || 'bottom';

    switch (animationPosition) {
      case 'top':
        return SlideInUp.duration(animationDuration);
      case 'bottom':
        return SlideInDown.duration(animationDuration);
      case 'left':
        return SlideInLeft.duration(animationDuration);
      case 'right':
        return SlideInRight.duration(animationDuration);
      case 'center':
        return FadeIn.duration(animationDuration);
      default:
        return FadeIn.duration(animationDuration);
    }
  };

  const isCentered = !highlightedLayout || step.popoverPosition === 'center';

  return (
    <Animated.View
      entering={getEnteringAnimation()}
      style={[
        isCentered ? styles.containerCentered : styles.container,
        position,
        animatedStyle,
        style,
      ]}
      pointerEvents="box-none"
    >
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
    </Animated.View>
  );
}

function calculatePopoverPosition(
  layout: MeasuredLayout | null | undefined,
  preferredPosition: 'top' | 'bottom' | 'left' | 'right' | 'center' | undefined,
  screenWidth: number
): { position: ViewStyle; actualPosition: 'top' | 'bottom' | 'left' | 'right' | 'center' } {
  const POPOVER_WIDTH = 300;
  const POPOVER_ESTIMATED_HEIGHT = 200; // Estimated height for positioning
  const SPACING = 16;
  const MINIMUM_SPACE = 240; // Minimum space needed for popover

  if (!layout || preferredPosition === 'center') {
    // Center on screen - use alignSelf and positioning
    return {
      position: {
        alignSelf: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
      },
      actualPosition: 'center',
    };
  }

  const { pageX, pageY, width, height } = layout;
  const screenHeight = Dimensions.get('window').height;

  // Calculate available space in each direction
  const spaceAbove = pageY;
  const spaceBelow = screenHeight - (pageY + height);
  const spaceLeft = pageX;
  const spaceRight = screenWidth - (pageX + width);

  // Determine optimal position based on available space
  let actualPosition = preferredPosition || 'bottom';

  if (preferredPosition === 'bottom' && spaceBelow < MINIMUM_SPACE && spaceAbove > spaceBelow) {
    // Not enough space below, but more space above - switch to top
    actualPosition = 'top';
  } else if (preferredPosition === 'top' && spaceAbove < MINIMUM_SPACE && spaceBelow > spaceAbove) {
    // Not enough space above, but more space below - switch to bottom
    actualPosition = 'bottom';
  } else if (preferredPosition === 'left' && spaceLeft < MINIMUM_SPACE && spaceRight > spaceLeft) {
    // Not enough space on left, but more space on right - switch to right
    actualPosition = 'right';
  } else if (preferredPosition === 'right' && spaceRight < MINIMUM_SPACE && spaceLeft > spaceRight) {
    // Not enough space on right, but more space on left - switch to left
    actualPosition = 'left';
  }

  // Calculate horizontal position (centered relative to element)
  const horizontalCenter = Math.max(
    SPACING,
    Math.min(
      pageX + width / 2 - POPOVER_WIDTH / 2,
      screenWidth - POPOVER_WIDTH - SPACING
    )
  );

  let positionStyle: ViewStyle;

  switch (actualPosition) {
    case 'top':
      positionStyle = {
        position: 'absolute',
        bottom: screenHeight - pageY + SPACING,
        left: horizontalCenter,
      };
      break;

    case 'bottom':
      positionStyle = {
        position: 'absolute',
        top: pageY + height + SPACING,
        left: horizontalCenter,
      };
      break;

    case 'left':
      positionStyle = {
        position: 'absolute',
        top: Math.max(SPACING, pageY + height / 2 - POPOVER_ESTIMATED_HEIGHT / 2),
        right: screenWidth - pageX + SPACING,
      };
      break;

    case 'right':
      positionStyle = {
        position: 'absolute',
        top: Math.max(SPACING, pageY + height / 2 - POPOVER_ESTIMATED_HEIGHT / 2),
        left: pageX + width + SPACING,
      };
      break;

    default:
      positionStyle = {
        position: 'absolute',
        top: pageY + height + SPACING,
        left: horizontalCenter,
      };
  }

  return {
    position: positionStyle,
    actualPosition: actualPosition as 'top' | 'bottom' | 'left' | 'right' | 'center',
  };
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1001,
  },
  containerCentered: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1001,
    justifyContent: 'center',
    alignItems: 'center',
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
