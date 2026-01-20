import { useMemo } from 'react';

export interface RandomAnimationConfig {
  delay?: number;
  direction?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Generates random animation props for elements
 * Each element gets a random slide-in direction and delay
 */
export const useRandomAnimation = (
  baseDelay: number = 0,
  customDirection?: 'top' | 'bottom' | 'left' | 'right'
): RandomAnimationConfig => {
  return useMemo(() => {
    const directions: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right'];

    return {
      delay: baseDelay + Math.random() * 0.4, // Random delay between 0-400ms
      direction: customDirection || directions[Math.floor(Math.random() * directions.length)],
    };
  }, [baseDelay, customDirection]);
};