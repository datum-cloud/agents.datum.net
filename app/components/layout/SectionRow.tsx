import type { ReactNode } from 'react';

type SectionRowProps = {
  /** Bold label rendered in the row's left mini-column. */
  label: string;
  /** Description / value content. Keep paragraphs short. */
  children: ReactNode;
};

/**
 * Two-column row used inside content-heavy sections (Platform Essentials,
 * Pricing, Programmatic Tools, Tools for humans, Platform Development).
 * Bottom border is the soft mist-line; the section's outer padding handles
 * top/bottom rhythm so consecutive rows stack flush.
 */
export function SectionRow({ label, children }: SectionRowProps) {
  return (
    <div className="border-border flex flex-col gap-4 border-b py-5 first:pt-0 last:border-b-0 lg:flex-row lg:gap-10">
      <p className="text-foreground w-full text-[14px] leading-[21px] font-semibold lg:w-[var(--section-row-label)] lg:shrink-0">
        {label}
      </p>
      <div className="text-foreground w-full text-[14px] leading-[21px] lg:flex-1">{children}</div>
    </div>
  );
}
