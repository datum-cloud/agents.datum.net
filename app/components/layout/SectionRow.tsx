import { useInView } from '@/hooks/useInView';
import type { ReactNode } from 'react';

type SectionRowProps = {
  label: string;
  children: ReactNode;
};

const EASING = 'cubic-bezier(0.4,0,0.2,1)';

export function SectionRow({ label, children }: SectionRowProps) {
  const [ref, state] = useInView<HTMLDivElement>();

  const style =
    state === 'initial'
      ? undefined
      : {
          opacity: state === 'visible' ? 1 : 0,
          transform: state === 'visible' ? 'translateY(0)' : 'translateY(16px)',
          transition: `opacity 0.5s ${EASING}, transform 0.5s ${EASING}`,
        };

  return (
    <div
      ref={ref}
      className="border-border flex flex-col gap-4 border-b py-5 first:pt-0 last:border-b-0 lg:flex-row lg:gap-10"
      style={style}>
      <p className="text-foreground w-full text-[14px] leading-[21px] font-semibold lg:w-[var(--section-row-label)] lg:shrink-0">
        {label}
      </p>
      <div className="text-foreground w-full text-[14px] leading-[21px] lg:flex-1">{children}</div>
    </div>
  );
}
