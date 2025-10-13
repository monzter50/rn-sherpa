import React, { useEffect } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  interpolate,
  Extrapolate,
  withSpring,
} from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';
import type { MeasuredLayout } from '../types';

interface AnimatedOverlayProps {
  /**
   * Layout of the highlighted component
   */
  highlightedLayout?: MeasuredLayout | null;

  /**
   * Overlay background color
   */
  color?: string;

  /**
   * Padding around highlighted element
   */
  padding?: number;

  /**
   * Border radius for the cutout
   */
  borderRadius?: number;

  /**
   * Custom overlay style
   */
  style?: ViewStyle;

  /**
   * Called when overlay is pressed (outside highlighted area)
   */
  onPress?: () => void;

  /**
   * Whether interactions should be blocked
   */
  blockInteractions?: boolean;

  /**
   * Animation duration in milliseconds
   */
  animationDuration?: number;
}

export function AnimatedOverlay({
  highlightedLayout,
  color = 'rgba(0, 0, 0, 0.75)',
  padding = 8,
  borderRadius = 8,
  style,
  onPress,
  blockInteractions = true,
  animationDuration = 300,
}: AnimatedOverlayProps) {
  const opacity = useSharedValue(0);
  const spotlightScale = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: animationDuration });
    spotlightScale.value = withTiming(1, {
      duration: animationDuration,
    });
  }, [animationDuration]);

  useEffect(() => {
    if (highlightedLayout) {
      spotlightScale.value = 0;
      spotlightScale.value = withTiming(1, {
        duration: animationDuration,
      });
    }
  }, [highlightedLayout, animationDuration]);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const spotlightAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      spotlightScale.value,
      [0, 1],
      [0.8, 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity: interpolate(
        spotlightScale.value,
        [0, 1],
        [0, 1],
        Extrapolate.CLAMP
      ),
    };
  });

  if (!highlightedLayout) {
    // Full screen overlay when no element is highlighted
    return (
      <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
        <Pressable
          style={[StyleSheet.absoluteFill, { backgroundColor: color }, style]}
          onPress={onPress}
          pointerEvents={blockInteractions ? 'auto' : 'box-none'}
        />
      </Animated.View>
    );
  }

  const { pageX, pageY, width, height } = highlightedLayout;

  // Calculate spotlight dimensions with padding
  const spotlightX = Math.max(0, pageX - padding);
  const spotlightY = Math.max(0, pageY - padding);
  const spotlightWidth = width + padding * 2;
  const spotlightHeight = height + padding * 2;

  return (
    <Animated.View style={[styles.overlay, overlayAnimatedStyle]} pointerEvents="box-none">
      {/* Top section */}
      <Pressable
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: spotlightY,
          backgroundColor: color,
        }}
        onPress={onPress}
        pointerEvents={blockInteractions ? 'auto' : 'box-none'}
      />

      {/* Left section */}
      <Pressable
        style={{
          position: 'absolute',
          top: spotlightY,
          left: 0,
          width: spotlightX,
          height: spotlightHeight,
          backgroundColor: color,
        }}
        onPress={onPress}
        pointerEvents={blockInteractions ? 'auto' : 'box-none'}
      />

      {/* Right section */}
      <Pressable
        style={{
          position: 'absolute',
          top: spotlightY,
          left: spotlightX + spotlightWidth,
          right: 0,
          height: spotlightHeight,
          backgroundColor: color,
        }}
        onPress={onPress}
        pointerEvents={blockInteractions ? 'auto' : 'box-none'}
      />

      {/* Bottom section */}
      <Pressable
        style={{
          position: 'absolute',
          top: spotlightY + spotlightHeight,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: color,
        }}
        onPress={onPress}
        pointerEvents={blockInteractions ? 'auto' : 'box-none'}
      />

      {/* Spotlight border for emphasis */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: spotlightY,
            left: spotlightX,
            width: spotlightWidth,
            height: spotlightHeight,
            borderRadius,
            borderWidth: 3,
            borderColor: 'rgba(255, 255, 255, 0.4)',
          },
          spotlightAnimatedStyle,
        ]}
        pointerEvents="none"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  overlaySection: {
    width: '100%',
  },
  overlayRow: {
    flexDirection: 'row',
  },
});
