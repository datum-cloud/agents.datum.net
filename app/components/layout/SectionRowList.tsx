import type { ReactNode } from 'react';

type SectionRowListProps = {
  children: ReactNode;
};

export function SectionRowList({ children }: SectionRowListProps) {
  return <div className="flex flex-col">{children}</div>;
}
