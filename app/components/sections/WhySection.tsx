import { Section } from '../layout/Section';
import { SectionBody } from '../layout/SectionBody';

export function WhySection() {
  return (
    <Section id="why" n="03" title="Why Datum Exists">
      <SectionBody>
        <p>
          Datum was founded on the basis of three trends: First, that software (and its data) was
          going everywhere. Next, that a new class of providers was being born. And finally, that
          the &lsquo;splinternet&rsquo; had arrived.
        </p>
        <p>
          In the future, we believe all companies will need to curate and control how they interact
          with providers, partners, customers and agents. Datum exists to help them do it.
        </p>
      </SectionBody>
    </Section>
  );
}
