import { Section } from '../layout/Section';
import { SectionBody } from '../layout/SectionBody';

export function CompanySection() {
  return (
    <Section id="company" n="01" title="Company">
      <SectionBody>
        <p>
          Datum is a venture-backed startup founded in late 2024 by Zac and Jacob Smith. It provides
          an open network cloud targeted at AI and [alt cloud](https://www.alt-cloud.org/) providers.
        </p>
      </SectionBody>
    </Section>
  );
}
