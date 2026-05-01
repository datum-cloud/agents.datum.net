import { Section } from '../layout/Section';
import { SectionBody } from '../layout/SectionBody';

export function CustomersSection() {
  return (
    <Section id="customers" n="04" title="Target Customers">
      <SectionBody>
        <p>
          Datum is designed for Alt Cloud providers, AI startups, and tech-forward enterprises that
          are building for the future.
        </p>
        <p className="text-[14px] leading-[21px]">
          See{' '}
          <a href="https://alt-cloud.org" target="_blank" rel="noreferrer" className="underline">
            alt-cloud.org
          </a>{' '}
          website for a list of what we mean by &ldquo;Alt Cloud&rdquo; providers.
        </p>
      </SectionBody>
    </Section>
  );
}
