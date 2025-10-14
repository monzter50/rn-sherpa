import { useEffect, RefObject } from 'react';
import { ScrollView } from 'react-native';
import { useTour } from '../context/TourContext';

export interface UseAutoScrollOptions {
  /**
   * Padding from the top when scrolling to element (default: 100)
   */
  topPadding?: number;

  /**
   * Whether to animate the scroll (default: true)
   */
  animated?: boolean;

  /**
   * Whether to enable auto-scroll (default: true)
   */
  enabled?: boolean;
}

/**
 * Automatically scrolls to the current tour step's highlighted element
 *
 * @param scrollViewRef - Reference to the ScrollView component
 * @param options - Configuration options for auto-scroll behavior
 *
 * @example
 * ```tsx
 * function MyApp() {
 *   const scrollViewRef = useRef<ScrollView>(null);
 *   useAutoScroll(scrollViewRef);
 *
 *   return (
 *     <ScrollView ref={scrollViewRef}>
 *       {/* Your content *\/}
 *     </ScrollView>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom options
 * useAutoScroll(scrollViewRef, {
 *   topPadding: 150,
 *   animated: true,
 *   enabled: true,
 * });
 * ```
 */
export function useAutoScroll(
  scrollViewRef: RefObject<ScrollView>,
  options: UseAutoScrollOptions = {}
): void {
  const {
    topPadding = 100,
    animated = true,
    enabled = true,
  } = options;

  const tour = useTour();

  useEffect(() => {
    if (!enabled || !tour.isActive || !tour.currentStep?.ref?.current || !scrollViewRef.current) {
      return;
    }

    const elementRef = tour.currentStep.ref.current;
    const scrollView = scrollViewRef.current;

    // Measure the element and scroll to it
    elementRef.measureLayout(
      scrollView as any,
      (_x: number, y: number, _width: number, height: number) => {
        // Scroll to position with padding
        scrollViewRef.current?.scrollTo({
          y: Math.max(0, y - topPadding),
          animated,
        });
      },
      () => {
        // Fallback: If measureLayout fails, try measureInWindow
        elementRef.measureInWindow((_x: number, y: number) => {
          scrollViewRef.current?.scrollTo({
            y: Math.max(0, y - topPadding),
            animated,
          });
        });
      }
    );
  }, [tour.isActive, tour.currentStep, tour.currentStepIndex, scrollViewRef, topPadding, animated, enabled]);
}
