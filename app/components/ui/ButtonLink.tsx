import { cn } from '@/lib/utils';
import type { AnchorHTMLAttributes } from 'react';

type ButtonLinkVariant = 'ghost' | 'primary';

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonLinkVariant;
};

export function ButtonLink({ variant = 'ghost', className, children, ...props }: ButtonLinkProps) {
  return (
    <a
      className={cn('btn', variant === 'primary' ? 'btn-primary' : 'btn-ghost', className)}
      {...props}>
      {children}
    </a>
  );
}
