import { SectionNumber } from './SectionNumber';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type SectionProps = {
  /** Stable anchor id (e.g. "company", "mission") for agent deep-linking. */
  id: string;
  /** Two-digit ordinal shown in the number pill, e.g. "01". */
  n: string;
  /** Section title, used both as the visible pill label and the (sr-only) <h2>. */
  title: string;
  /** Right column content. */
  children: ReactNode;
  className?: string;
};

/**
 * Generic two-column section: number pill on the left, content on the right,
 * with the canonical 1px fjord top border and 64px vertical padding from the
 * Figma source. The visible h2 is hidden visually because the design uses the
 * pill as the visual heading; the h2 stays for semantic / a11y reasons.
 */
export function Section({ id, n, title, children, className }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'border-foreground dark:border-border bg-background border-t py-16',
        'flex flex-col gap-16',
        className
      )}>
      <h2 className="sr-only">
        {n} {title}
      </h2>
      <div className="flex flex-col items-start gap-10 lg:flex-row">
        <div className="w-full lg:w-[var(--section-number-col)] lg:shrink-0" aria-hidden="true">
          <SectionNumber n={n} label={title} />
        </div>
        <div className="w-full lg:max-w-[var(--section-content-max)] lg:flex-1">{children}</div>
      </div>
    </section>
  );
}
