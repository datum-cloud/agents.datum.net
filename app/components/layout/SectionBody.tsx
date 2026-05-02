import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type SectionBodyProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Prose wrapper for section body text. Sets the shared typography scale
 * (16px / 24px leading, foreground token) and stacks multiple paragraphs
 * with a consistent gap.
 */
export function SectionBody({ children, className }: SectionBodyProps) {
  return (
    <div
      className={cn('text-foreground flex flex-col gap-4 text-[16px] leading-[24px]', className)}>
      {children}
    </div>
  );
}
