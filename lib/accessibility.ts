/**
 * Keyboard navigation support for the game
 */

export function useKeyboardNavigation(
  enabled: boolean,
  onAnswer: (index: number) => void,
  bubbleCount: number
) {
  if (typeof window === 'undefined') return;

  const handleKeyPress = (event: KeyboardEvent) => {
    if (!enabled) return;

    // Number keys 0-9 for direct selection
    if (event.key >= '0' && event.key <= '9') {
      const index = parseInt(event.key);
      if (index > 0 && index <= bubbleCount) {
        onAnswer(index - 1);
      }
    }

    // Arrow keys for navigation (optional enhancement)
    // Space or Enter could also be used for selection
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string): void {
  if (typeof document === 'undefined') return;

  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Screen reader only text utility class
 */
export const srOnlyClass = 'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0';
