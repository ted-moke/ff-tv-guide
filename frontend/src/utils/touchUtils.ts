import { useRef, useCallback } from 'react';

export interface TouchGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventDefault?: boolean;
}

export interface TouchGestureCallbacks {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

/**
 * Custom hook for detecting touch gestures (swipe, tap, etc.)
 * @param options Configuration object for gesture detection
 * @returns Touch event handlers and gesture state
 */
export const useTouchGestures = (options: TouchGestureOptions = {}): TouchGestureCallbacks => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventDefault = false
  } = options;

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (preventDefault) {
      e.preventDefault();
    }
    
    const touch = e.targetTouches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  }, [preventDefault]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (preventDefault) {
      e.preventDefault();
    }
    
    const touch = e.targetTouches[0];
    touchEndX.current = touch.clientX;
    touchEndY.current = touch.clientY;
  }, [preventDefault]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (preventDefault) {
      e.preventDefault();
    }

    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = touchStartY.current - touchEndY.current;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Determine if it's a horizontal or vertical swipe
    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (absDeltaX > threshold) {
        if (deltaX > 0) {
          onSwipeLeft?.();
        } else {
          onSwipeRight?.();
        }
      }
    } else {
      // Vertical swipe
      if (absDeltaY > threshold) {
        if (deltaY > 0) {
          onSwipeUp?.();
        } else {
          onSwipeDown?.();
        }
      }
    }
  }, [threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, preventDefault]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
};

/**
 * Simple hook for horizontal swipe detection only
 * @param onSwipeLeft Callback for left swipe
 * @param onSwipeRight Callback for right swipe
 * @param threshold Minimum distance for swipe detection
 * @returns Touch event handlers
 */
export const useHorizontalSwipe = (
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold: number = 60
): TouchGestureCallbacks => {
  return useTouchGestures({
    onSwipeLeft,
    onSwipeRight,
    threshold
  });
};

/**
 * Simple hook for vertical swipe detection only
 * @param onSwipeUp Callback for up swipe
 * @param onSwipeDown Callback for down swipe
 * @param threshold Minimum distance for swipe detection
 * @returns Touch event handlers
 */
export const useVerticalSwipe = (
  onSwipeUp?: () => void,
  onSwipeDown?: () => void,
  threshold: number = 50
): TouchGestureCallbacks => {
  return useTouchGestures({
    onSwipeUp,
    onSwipeDown,
    threshold
  });
};
