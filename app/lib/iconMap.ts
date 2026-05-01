import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  Github,
  Globe,
  Info,
  LogIn,
  Menu,
  Minus,
  Moon,
  Plus,
  Search,
  Sun,
  Terminal,
  X,
} from 'lucide-react';

/**
 * Map kebab-case icon names to lucide-react components. Mirrors the pattern
 * used on `datum.net` (`src/utils/iconMap.ts`) so the same icon vocabulary
 * works across both sites. Extend incrementally: add the lucide import +
 * an entry in `iconMap` when a new icon is needed.
 *
 * Brand-marked icons (Discord, YouTube, LinkedIn, Datum logo) are NOT here —
 * they're handled by the `<Icon>` component directly so the brand-styled
 * SVGs always win over any equivalent lucide variant.
 */
export const iconMap = {
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  copy: Copy,
  download: Download,
  'external-link': ExternalLink,
  github: Github,
  globe: Globe,
  info: Info,
  'log-in': LogIn,
  menu: Menu,
  minus: Minus,
  moon: Moon,
  plus: Plus,
  search: Search,
  sun: Sun,
  terminal: Terminal,
  x: X,
} as const;

export type LucideIconName = keyof typeof iconMap;

export function getIcon(name: string) {
  return iconMap[name as LucideIconName] ?? null;
}
