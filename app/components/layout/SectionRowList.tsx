import type { ReactNode } from 'react';

type SectionRowListProps = {
  children: ReactNode;
};

/**
 * Stacking container for SectionRow items. Rows supply their own borders and
 * padding; this wrapper simply removes the gap so rows sit flush.
 */
export function SectionRowList({ children }: SectionRowListProps) {
  return <div className="flex flex-col">{children}</div>;
}
