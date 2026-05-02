type SectionNumberProps = {
  /** Two-digit ordinal, e.g. "01". */
  n: string;
  /** Plain-text label that follows the ordinal (rendered in the same pill). */
  label: string;
};

/**
 * Inverted inline pill that prefixes each numbered section ("01 Company"…).
 * Monospace; uses foreground/background tokens so it auto-inverts in dark
 * mode (light-on-dark in light, dark-on-light in dark). Sits in the left
 * column of every section.
 */
export function SectionNumber({ n, label }: SectionNumberProps) {
  return (
    <span className="bg-foreground dark:bg-app-dark-utility-1 text-background dark:text-foreground inline-flex items-center justify-center pt-px pr-1.5 pl-[9px] font-mono text-[16px] leading-[26px] whitespace-nowrap">
      {n} {label}
    </span>
  );
}
