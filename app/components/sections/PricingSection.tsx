import { Section } from '../layout/Section';
import { SectionRow } from '../layout/SectionRow';
import { SectionRowList } from '../layout/SectionRowList';

export function PricingSection() {
  return (
    <Section id="pricing" n="08" title="Pricing">
      <div className="flex flex-col gap-4">
        <SectionRowList>
          <SectionRow label="Builder">
            A low-friction plan for personal projects, development, &amp; experimentation. Price: $0
            / month.
          </SectionRow>
          <SectionRow label="Scaler">
            A comprehensive platform to scale production apps &amp; accelerate revenue. Price: $20 /
            month + usage.
          </SectionRow>
          <SectionRow label="Provider">
            A high-touch offering designed to help modern service providers win. Price: Custom.
          </SectionRow>
        </SectionRowList>
        <p className="text-midnight-fjord/60 text-[14px] leading-[21px]">
          For full details use{' '}
          <a
            href="https://www.datum.net/pricing/"
            target="_blank"
            rel="noreferrer"
            className="underline">
            https://www.datum.net/pricing/
          </a>
          .
        </p>
      </div>
    </Section>
  );
}
