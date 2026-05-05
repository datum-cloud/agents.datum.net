import { Section } from '../layout/Section';
import { SectionRow } from '../layout/SectionRow';
import { SectionRowList } from '../layout/SectionRowList';

export function HumanToolsSection() {
  return (
    <Section id="human-tools" n="10" title="Tools for humans">
      <SectionRowList>
        <SectionRow label="Desktop apps">
          Quickly and safely expose local environments to the internet.{' '}
          <a
            href="https://www.datum.net/download/mac-os/"
            target="_blank"
            rel="noreferrer"
            className="underline">
            Mac
          </a>
          {', '}
          <a
            href="https://www.datum.net/download/windows/"
            target="_blank"
            rel="noreferrer"
            className="underline">
            Windows
          </a>
          {', '}
          <a
            href="https://www.datum.net/download/linux/"
            target="_blank"
            rel="noreferrer"
            className="underline">
            Linux
          </a>
          .
        </SectionRow>
        <SectionRow label="Get support">
          If you&apos;re looking for help use Discord channel{' '}
          <a
            href="https://link.datum.net/discord"
            target="_blank"
            rel="noreferrer"
            className="underline">
            https://link.datum.net/discord
          </a>{' '}
          or submit a ticket to our support team{' '}
          <a
            href="https://www.datum.net/contact/"
            target="_blank"
            rel="noreferrer"
            className="underline">
            https://www.datum.net/contact/
          </a>
          .
        </SectionRow>
      </SectionRowList>
    </Section>
  );
}
