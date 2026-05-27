import { useTheme } from '@datum-cloud/datum-ui/theme';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type Mode = 'system' | 'light' | 'dark';

const NEXT: Record<Mode, Mode> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
};

const LABEL: Record<Mode, string> = {
  system: 'Auto',
  light: 'Light',
  dark: 'Dark',
};

function ModeIcon({ mode, className }: { mode: Mode; className?: string }) {
  if (mode === 'light') return <Sun className={className} aria-hidden="true" />;
  if (mode === 'dark') return <Moon className={className} aria-hidden="true" />;
  return <Monitor className={className} aria-hidden="true" />;
}

/**
 * Square icon button that cycles colour scheme on click:
 *   system → light → dark → system
 *
 * `useTheme()` returns `undefined` during SSR / first paint, so the button
 * renders the system-mode icon until mounted to avoid a hydration flicker.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const current = (mounted ? (theme as Mode | undefined) : undefined) ?? 'system';
  const next = NEXT[current];

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Colour scheme — currently ${LABEL[current]}. Click to switch to ${LABEL[next]}.`}
      title={`Switch to ${LABEL[next]}`}
      className="text-foreground hover:bg-muted focus-visible:bg-muted hover:border-border focus-visible:border-border inline-flex h-10 w-10 items-center justify-center rounded-md border border-transparent transition-colors">
      <ModeIcon mode={current} className="h-4 w-4" />
    </button>
  );
}
