import { FadeIn } from '../ui/FadeIn';
import { SectionNumber } from './SectionNumber';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type SectionProps = {
  id: string;
  n: string;
  title: string;
  children: ReactNode;
  className?: string;
};

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
        <FadeIn className="w-full lg:max-w-[var(--section-content-max)] lg:flex-1" delay={0.1}>
          {children}
        </FadeIn>
      </div>
    </section>
  );
}
