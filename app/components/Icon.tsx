import { DatumLogoIcon } from './icons/DatumLogoIcon';
import { DiscordIcon } from './icons/DiscordIcon';
import { LinkedinIcon } from './icons/LinkedinIcon';
import { YoutubeIcon } from './icons/YoutubeIcon';
import { getIcon, type LucideIconName } from '@/lib/iconMap';
import { cn } from '@/lib/utils';
import { HelpCircle } from 'lucide-react';

/** Brand-marked icons that always take precedence over lucide equivalents. */
type BrandIconName = 'discord' | 'youtube' | 'linkedin' | 'datum-logo';

/** Public name string accepted by the {@link Icon} component. */
export type IconName = BrandIconName | LucideIconName;

type IconSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const sizeClasses: Record<IconSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
  '2xl': 'h-10 w-10',
};

type IconProps = {
  /**
   * Kebab-case icon name. Brand icons (`discord`, `youtube`, `linkedin`,
   * `datum-logo`) take precedence over lucide-react equivalents; everything
   * else routes through `iconMap`.
   */
  name: IconName | (string & {});
  /** Tailwind size class shorthand. Defaults to `md` (h-5 w-5). */
  size?: IconSize;
  /** Extra utilities, e.g. `text-midnight-fjord` to recolor the currentColor fill. */
  className?: string;
};

/**
 * Single entry point for icons across the site. Mirrors the `<Icon>` API used
 * on `datum.net` so design-time references like "use the discord icon" map to
 * the same name in both codebases.
 *
 * Resolution order: brand icon → lucide icon (via {@link iconMap}) → fallback.
 */
export function Icon({ name, size = 'md', className }: IconProps) {
  const sizeClass = sizeClasses[size];
  const composed = cn(sizeClass, className);

  switch (name) {
    case 'discord':
      return <DiscordIcon className={composed} />;
    case 'youtube':
      return <YoutubeIcon className={composed} />;
    case 'linkedin':
      return <LinkedinIcon className={composed} />;
    case 'datum-logo':
      return <DatumLogoIcon className={composed} />;
  }

  const LucideIcon = getIcon(name);
  if (LucideIcon) {
    return <LucideIcon className={composed} aria-hidden="true" />;
  }

  return <HelpCircle className={composed} aria-hidden="true" />;
}
