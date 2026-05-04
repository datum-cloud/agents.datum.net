import { useEffect, useLayoutEffect, useRef, useState } from 'react';

type ViewState = 'initial' | 'hidden' | 'visible';

const useIsomorphicLayoutEffect = typeof document !== 'undefined' ? useLayoutEffect : useEffect;

export function useInView<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  const [state, setState] = useState<ViewState>('initial');

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Hide before first paint so transitions always have a start state
    setState('hidden');

    const rect = el.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;

    if (inViewport) {
      // Double rAF ensures the browser has committed the hidden state
      // before we trigger the transition to visible
      let raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => setState('visible'));
      });
      return () => cancelAnimationFrame(raf);
    }

    if (typeof IntersectionObserver === 'undefined') {
      setState('visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('visible');
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, state] as const;
}
