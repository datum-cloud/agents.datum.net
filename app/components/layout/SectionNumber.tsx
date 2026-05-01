type SectionNumberProps = {
  /** Two-digit ordinal, e.g. "01". */
  n: string;
  /** Plain-text label that follows the ordinal (rendered in the same pill). */
  label: string;
};

/**
 * Dark inline pill that prefixes each numbered section ("01 Company"…).
 * Monospace, white-on-fjord, sits in the left column of every section.
 */
export function SectionNumber({ n, label }: SectionNumberProps) {
  return (
    <span className="bg-midnight-fjord inline-flex items-center justify-center pt-px pr-1.5 pl-[9px] font-mono text-[16px] leading-[26px] whitespace-nowrap text-white">
      {n} {label}
    </span>
  );
}
