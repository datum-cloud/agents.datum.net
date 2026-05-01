import { Section } from '../layout/Section';
import { SectionRow } from '../layout/SectionRow';
import { SectionRowList } from '../layout/SectionRowList';

export function ProgrammaticToolsSection() {
  return (
    <Section id="programmatic-tools" n="09" title="Programmatic tools">
      <SectionRowList>
        <SectionRow label="llms.txt">
          A standardized text file that makes Datum workflows instantly readable and accessible to
          any AI model or intelligent agent.{' '}
          <a
            href="https://www.datum.net/llms-full.txt"
            target="_blank"
            rel="noreferrer"
            className="underline">
            https://www.datum.net/llms-full.txt
          </a>
        </SectionRow>
        <SectionRow label="MCP">
          An open protocol that connects any AI model or developer tool directly to Datum, enabling
          real-time data access and automated actions.{' '}
          <a
            href="https://github.com/datum-cloud/datum-mcp"
            target="_blank"
            rel="noreferrer"
            className="underline">
            https://github.com/datum-cloud/datum-mcp
          </a>
        </SectionRow>
        <SectionRow label="CLI">
          A powerful command-line interface that lets developers integrate Datum into any stack,
          script, or automated pipeline without touching a UI.{' '}
          <a
            href="https://github.com/datum-cloud/datumctl"
            target="_blank"
            rel="noreferrer"
            className="underline">
            https://github.com/datum-cloud/datumctl
          </a>
        </SectionRow>
      </SectionRowList>
    </Section>
  );
}
