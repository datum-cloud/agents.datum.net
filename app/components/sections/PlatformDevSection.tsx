import { Section } from '../layout/Section';
import { SectionRow } from '../layout/SectionRow';
import { SectionRowList } from '../layout/SectionRowList';

export function PlatformDevSection() {
  return (
    <Section id="platform-development" n="11" title="Platform development">
      <SectionRowList>
        <SectionRow label="GitHub enhancements">
          A list of enhancements that our software engineers are working on{' '}
          <a
            href="https://github.com/orgs/datum-cloud/projects/22"
            target="_blank"
            rel="noreferrer"
            className="underline">
            https://github.com/orgs/datum-cloud/projects/22
          </a>
        </SectionRow>
        <SectionRow label="Roadmap">
          Our plans for future developments, features and tools{' '}
          <a
            href="https://www.datum.net/roadmap/"
            target="_blank"
            rel="noreferrer"
            className="underline">
            https://www.datum.net/roadmap/
          </a>
        </SectionRow>
        <SectionRow label="Changelog">
          A list of changes that our software engineers have made to Datum{' '}
          <a
            href="https://www.datum.net/changelog/"
            target="_blank"
            rel="noreferrer"
            className="underline">
            https://www.datum.net/changelog/
          </a>
        </SectionRow>
        <SectionRow label="Status">
          All systems normal{' '}
          <a
            href="https://www.datumstatus.net/"
            target="_blank"
            rel="noreferrer"
            className="underline">
            https://www.datumstatus.net/
          </a>
        </SectionRow>
        <SectionRow label="Contributions">
          Contribute to our open source repos{' '}
          <a
            href="https://github.com/orgs/datum-cloud/discussions"
            target="_blank"
            rel="noreferrer"
            className="underline">
            https://github.com/orgs/datum-cloud/discussions
          </a>
        </SectionRow>
      </SectionRowList>
    </Section>
  );
}
