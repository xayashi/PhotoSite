import { useEffect, useRef } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(active = true) {
  const ref = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (!active || !ref.current) return;

    previousFocus.current = document.activeElement;

    // Focus first focusable element
    const focusable = ref.current.querySelectorAll(FOCUSABLE);
    if (focusable.length) focusable[0].focus({ preventScroll: true });

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      const nodes = ref.current.querySelectorAll(FOCUSABLE);
      if (!nodes.length) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus.current?.focus({ preventScroll: true });
    };
  }, [active]);

  return ref;
}
