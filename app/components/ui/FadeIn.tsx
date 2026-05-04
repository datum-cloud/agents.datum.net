import { useInView } from '@/hooks/useInView';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const EASING = 'cubic-bezier(0.4,0,0.2,1)';

export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  const [ref, state] = useInView<HTMLDivElement>();

  const style =
    state === 'initial'
      ? undefined
      : {
          opacity: state === 'visible' ? 1 : 0,
          transform: state === 'visible' ? 'translateY(0)' : 'translateY(20px)',
          transition: `opacity 0.6s ${EASING} ${delay}s, transform 0.6s ${EASING} ${delay}s`,
        };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
