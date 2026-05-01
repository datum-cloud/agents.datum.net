import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type PageContainerProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Centers content at the design's max width (1536px) and applies the outer
 * gutter (clamp() that hits 76px on wide screens, per Figma).
 */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[var(--page-max-width)] px-[var(--page-gutter)]',
        className
      )}>
      {children}
    </div>
  );
}
