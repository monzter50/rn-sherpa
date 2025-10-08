import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import type { ViewStyle } from 'react-native';
import type { MeasuredLayout } from '../types';

interface OverlayProps {
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
}

export function Overlay({
  highlightedLayout,
  color = 'rgba(0, 0, 0, 0.75)',
  padding = 8,
  borderRadius = 8,
  style,
  onPress,
  blockInteractions = true,
}: OverlayProps) {
  if (!highlightedLayout) {
    // Full screen overlay when no element is highlighted
    return (
      <Pressable
        style={[styles.overlay, { backgroundColor: color }, style]}
        onPress={onPress}
        pointerEvents={blockInteractions ? 'auto' : 'box-none'}
      />
    );
  }

  const { pageX, pageY, width, height } = highlightedLayout;

  // Calculate spotlight dimensions with padding
  const spotlightX = pageX - padding;
  const spotlightY = pageY - padding;
  const spotlightWidth = width + padding * 2;
  const spotlightHeight = height + padding * 2;

  return (
    <Pressable
      style={[styles.overlay, style]}
      onPress={onPress}
      pointerEvents={blockInteractions ? 'auto' : 'box-none'}
    >
      {/* Top overlay */}
      <View
        style={[
          styles.overlaySection,
          {
            backgroundColor: color,
            height: spotlightY,
          },
        ]}
      />

      {/* Middle row */}
      <View style={[styles.overlayRow, { height: spotlightHeight }]}>
        {/* Left overlay */}
        <View
          style={[
            styles.overlaySection,
            {
              backgroundColor: color,
              width: spotlightX,
            },
          ]}
        />

        {/* Spotlight cutout */}
        <View
          style={{
            width: spotlightWidth,
            height: spotlightHeight,
            borderRadius,
          }}
          pointerEvents="box-none"
        />

        {/* Right overlay */}
        <View
          style={[
            styles.overlaySection,
            {
              backgroundColor: color,
              flex: 1,
            },
          ]}
        />
      </View>

      {/* Bottom overlay */}
      <View
        style={[
          styles.overlaySection,
          {
            backgroundColor: color,
            flex: 1,
          },
        ]}
      />
    </Pressable>
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
