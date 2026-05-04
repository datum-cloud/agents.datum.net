import { useInView } from '@/hooks/useInView';

type SectionNumberProps = {
  n: string;
  label: string;
};

export function SectionNumber({ n, label }: SectionNumberProps) {
  const [ref, state] = useInView<HTMLSpanElement>();

  const style =
    state === 'initial'
      ? undefined
      : {
          opacity: state === 'visible' ? 1 : 0,
          transform: state === 'visible' ? 'translateX(0)' : 'translateX(-10px)',
          transition:
            'opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)',
        };

  return (
    <span
      ref={ref}
      className="bg-foreground dark:bg-app-dark-utility-1 text-background dark:text-foreground inline-flex items-center justify-center pt-px pr-1.5 pl-[9px] font-mono text-[16px] leading-[26px] whitespace-nowrap"
      style={style}>
      {n} {label}
    </span>
  );
}
