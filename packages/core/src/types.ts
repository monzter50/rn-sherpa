import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

/**
 * Configuration for a single step in the tour
 */
export interface TourStep {
  /**
   * Unique identifier for the step
   */
  id: string;

  /**
   * Text content to display in the popover
   */
  text: string;

  /**
   * Optional title for the popover
   */
  title?: string;

  /**
   * Reference to the component to highlight
   * Can be obtained using the useStepRef hook
   */
  ref?: React.RefObject<any>;

  /**
   * Optional custom popover content
   */
  popoverContent?: ReactNode;

  /**
   * Position of the popover relative to the highlighted element
   */
  popoverPosition?: 'top' | 'bottom' | 'left' | 'right' | 'center';

  /**
   * Optional callback when the step is shown
   */
  onShow?: () => void;

  /**
   * Optional callback when the step is hidden
   */
  onHide?: () => void;

  /**
   * Padding around the highlighted element
   */
  padding?: number;

  /**
   * Border radius for the spotlight
   */
  borderRadius?: number;
}

/**
 * Configuration for the tour
 */
export interface TourConfig {
  /**
   * Array of tour steps
   */
  steps: TourStep[];

  /**
   * Whether to show navigation buttons
   * @default true
   */
  showButtons?: boolean;

  /**
   * Whether to show step progress (e.g., "1 of 5")
   * @default true
   */
  showProgress?: boolean;

  /**
   * Whether to allow closing the tour
   * @default true
   */
  allowClose?: boolean;

  /**
   * Whether to animate transitions between steps
   * @default true
   */
  animate?: boolean;

  /**
   * Overlay color
   * @default 'rgba(0, 0, 0, 0.75)'
   */
  overlayColor?: string;

  /**
   * Custom styles for the popover
   */
  popoverStyle?: ViewStyle;

  /**
   * Custom styles for overlay
   */
  overlayStyle?: ViewStyle;

  /**
   * Callback when tour starts
   */
  onStart?: () => void;

  /**
   * Callback when tour completes
   */
  onComplete?: () => void;

  /**
   * Callback when tour is skipped/closed
   */
  onSkip?: () => void;
}

/**
 * Tour context value
 */
export interface TourContextValue {
  /**
   * Current step index
   */
  currentStepIndex: number;

  /**
   * Total number of steps
   */
  totalSteps: number;

  /**
   * Whether the tour is active
   */
  isActive: boolean;

  /**
   * Start the tour
   */
  start: () => void;

  /**
   * Stop the tour
   */
  stop: () => void;

  /**
   * Go to next step
   */
  next: () => void;

  /**
   * Go to previous step
   */
  previous: () => void;

  /**
   * Go to a specific step
   */
  goToStep: (index: number) => void;

  /**
   * Current step configuration
   */
  currentStep: TourStep | null;
}

/**
 * Measured layout for a component
 */
export interface MeasuredLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
}
