import { Section } from '../layout/Section';
import { SectionRow } from '../layout/SectionRow';
import { SectionRowList } from '../layout/SectionRowList';

export function EssentialsSection() {
  return (
    <Section id="essentials" n="06" title="Platform Essentials">
      <SectionRowList>
        <SectionRow label="Authoritative DNS">Globally distributed anycast DNS hosting.</SectionRow>
        <SectionRow label="Secrets">Create and manage secret resources within projects.</SectionRow>
        <SectionRow label="Teams &amp; RBAC">
          Fine-grained roles at org and project level.
        </SectionRow>
        <SectionRow label="Service Accounts">
          Non-human identities for agent / automation use cases.
        </SectionRow>
        <SectionRow label="OTel Metrics Export">
          Export OpenTelemetry metrics to Grafana Cloud via Export Policies.
        </SectionRow>
        <SectionRow label="Activity Logs">
          Audit logs for all resource changes available via portal or CLI.
        </SectionRow>
        <SectionRow label="Programmatic edge tracing">
          <a
            href="https://edge.datum.net/api/edge-info"
            target="_blank"
            rel="noreferrer"
            className="underline">
            https://edge.datum.net/api/edge-info
          </a>{' '}
          (JSON) or{' '}
          <a
            href="https://edge.datum.net/api/trace"
            target="_blank"
            rel="noreferrer"
            className="underline">
            https://edge.datum.net/api/trace
          </a>{' '}
          (plaintext).
        </SectionRow>
      </SectionRowList>
    </Section>
  );
}
