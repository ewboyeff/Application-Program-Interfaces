import { useEffect, useRef } from 'react';

const EVENTS = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'] as const;

export function useInactivityTimeout(
  onTimeout: () => void,
  timeoutMs: number,
  enabled = true,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(onTimeout);
  callbackRef.current = onTimeout;

  useEffect(() => {
    if (!enabled) return;

    const reset = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callbackRef.current(), timeoutMs);
    };

    reset();
    EVENTS.forEach(e => window.addEventListener(e, reset, { passive: true }));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      EVENTS.forEach(e => window.removeEventListener(e, reset));
    };
  }, [enabled, timeoutMs]);
}
