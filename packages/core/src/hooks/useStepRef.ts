import { useRef } from 'react';

/**
 * Hook to create a ref for a tour step target
 *
 * @example
 * ```tsx
 * const stepRef = useStepRef();
 *
 * <View ref={stepRef}>
 *   <Text>This component will be highlighted</Text>
 * </View>
 * ```
 */
export function useStepRef<T = any>() {
  return useRef<T>(null);
}
