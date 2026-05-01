import { Section } from '../layout/Section';
import { SectionBody } from '../layout/SectionBody';

export function RegionsSection() {
  return (
    <Section id="regions" n="07" title="Global Network Regions">
      <SectionBody>
        <p>
          Datum operates high-performance physical compute and network infrastructure at the key
          interconnection points around the world.{' '}
          <a
            href="https://www.datum.net/locations/"
            target="_blank"
            rel="noreferrer"
            className="underline">
            https://www.datum.net/locations/
          </a>
        </p>
      </SectionBody>
    </Section>
  );
}
