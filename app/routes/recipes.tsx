import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Section } from '@/components/layout/Section';
import { SectionBody } from '@/components/layout/SectionBody';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { buildMeta } from '@/lib/seo';
import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = ({ matches }) => {
  const parentMeta = matches.flatMap((match) => match.meta ?? []);
  return [
    ...parentMeta,
    ...buildMeta({
      title: 'Datum — Agent Recipes',
      description:
        'Canonical, copy-pasteable task flows for agents operating Datum using real datumctl commands.',
      path: '/docs/recipes',
    }),
  ];
};

export default function AgentRecipes() {
  return (
    <>
      <Header />
      <main id="main" className="bg-background text-foreground min-h-dvh">
        <PageContainer className="py-16">
          <a href="/" className="md-trigger">
            <span aria-hidden="true" className="md-trigger__arrow">
              ←
            </span>
            <span>Back to agents.datum.net</span>
          </a>
          <h1 className="mt-6 text-[32px] leading-[38px] font-semibold">Datum — Agent Recipes</h1>
          <p className="text-foreground/70 mt-4 max-w-[var(--section-content-max)] text-[16px] leading-[24px]">
            Canonical, copy-pasteable task flows for agents operating Datum using real{' '}
            <code className="font-mono text-[0.875em]">datumctl</code> commands. Where a recipe
            needs a resource manifest, it discovers the schema first with{' '}
            <code className="font-mono text-[0.875em]">explain</code> rather than assuming field
            names — treat inline YAML as illustrative and confirm fields at runtime.
          </p>
        </PageContainer>

        <PageContainer>
          <Section id="recipe-1" n="01" title="Authenticated Endpoint">
            <div className="flex flex-col gap-4">
              <SectionBody>
                <p>
                  An agent should not handle raw tokens. Sign in once, then run a local proxy that
                  carries the session.
                </p>
              </SectionBody>
              <CodeBlock>{`# Headless / container / SSH: device-code login (opens no browser)
datumctl auth login --no-browser
# → prints a short code + link; approve it on any device.

# Start a local authenticated gateway. With no --port it picks a free port
# and prints the bare URL as the first stdout line — read that as readiness.
URL=$(datumctl api proxy --quiet | head -n1)

# Anything that speaks HTTP now reaches the platform with no token wiring:
curl "$URL/apis/resourcemanager.miloapis.com/v1alpha1/organizations"`}</CodeBlock>
              <SectionBody>
                <ul className="flex flex-col gap-2">
                  <li>
                    Scope to a single control plane with{' '}
                    <code className="font-mono text-[0.875em]">--project &lt;p&gt;</code> or{' '}
                    <code className="font-mono text-[0.875em]">--organization &lt;o&gt;</code>; URLs
                    then drop the long control-plane prefix.
                  </li>
                  <li>
                    Watches and server-sent events stream through unbuffered — long-lived watch
                    clients work as if talking to the real API.
                  </li>
                  <li>
                    Session and scope are pinned when the proxy starts. Running{' '}
                    <code className="font-mono text-[0.875em]">datumctl auth switch</code> or{' '}
                    <code className="font-mono text-[0.875em]">ctx use</code> afterward does not
                    repoint a running proxy — restart it.
                  </li>
                  <li>
                    For fully autonomous agents, issue a Service Account credential (via IAM)
                    instead of an interactive login. Confirm the exact issuance command against{' '}
                    <code className="font-mono text-[0.875em]">datumctl explain</code> / the IAM
                    docs before shipping this step.
                  </li>
                </ul>
              </SectionBody>
            </div>
          </Section>

          <Section id="recipe-2" n="02" title="API Discovery">
            <div className="flex flex-col gap-4">
              <SectionBody>
                <p>
                  The API is self-describing. An agent can map the whole surface without external
                  docs.
                </p>
              </SectionBody>
              <CodeBlock>{`# 1. List every resource type available to you.
datumctl api-resources

# 2. Read the schema and field docs for one, drilling into any path.
datumctl explain httpproxies.spec
datumctl explain httpproxies.spec.hostnames

# 3. Preview a change before making it.
datumctl diff -f desired-state.yaml`}</CodeBlock>
              <SectionBody>
                <p>
                  Use this loop whenever you&apos;re unsure of a field:{' '}
                  <code className="font-mono text-[0.875em]">api-resources</code> →{' '}
                  <code className="font-mono text-[0.875em]">
                    explain &lt;kind&gt;[.&lt;path&gt;]
                  </code>{' '}
                  → build the manifest → <code className="font-mono text-[0.875em]">diff</code> →{' '}
                  <code className="font-mono text-[0.875em]">apply</code>.
                </p>
              </SectionBody>
            </div>
          </Section>

          <Section id="recipe-3" n="03" title="Deploy Compute">
            <div className="flex flex-col gap-4">
              <SectionBody>
                <p>
                  Two paths. The plugin path is fastest; the declarative path is what an agent
                  should prefer for idempotency and review.
                </p>
                <p className="font-semibold">Fast path (plugin command):</p>
              </SectionBody>
              <CodeBlock>{`datumctl plugin install compute
datumctl compute deploy   # see \`datumctl compute deploy --help\` for flags`}</CodeBlock>
              <SectionBody>
                <p className="font-semibold">Declarative path (recommended for agents):</p>
              </SectionBody>
              <CodeBlock>{`# 1. Find the compute resource kind and confirm its fields.
datumctl api-resources | grep -i compute
datumctl explain <compute-kind>.spec          # substitute the kind from step 1

# 2. Write a manifest using ONLY fields confirmed above. Illustrative shape:
cat > workload.yaml <<'YAML'
# apiVersion / kind / spec fields MUST be taken from \`explain\` output above —
# the block below is a placeholder to show structure, not verified schema.
apiVersion: <group>/<version>
kind: <ComputeKind>
metadata:
  name: hello-agent
spec:
  # scale-to-zero, per-second metered; set vCPU / memory / image / region here
YAML

# 3. Preview, apply (retry-safe), verify.
datumctl diff -f workload.yaml
datumctl apply -f workload.yaml
datumctl get <compute-kind> hello-agent`}</CodeBlock>
              <SectionBody>
                <p className="text-foreground/60 text-[14px] leading-[21px]">
                  Cost to reason about before deploying: $0.0504/vCPU-hour + $0.0162/GiB-hour,
                  metered per second, billed only while running. Ingress free; first 200 GB/mo
                  egress free.
                </p>
              </SectionBody>
            </div>
          </Section>

          <Section id="conventions" n="04" title="Conventions for agents">
            <SectionBody>
              <ul className="flex flex-col gap-2">
                <li>
                  Prefer <code className="font-mono text-[0.875em]">apply</code> over imperative
                  create/edit — it&apos;s declarative and conflict-managed, so retries converge
                  instead of erroring.
                </li>
                <li>
                  Always <code className="font-mono text-[0.875em]">diff</code> before{' '}
                  <code className="font-mono text-[0.875em]">apply</code> on anything that mutates
                  state.
                </li>
                <li>
                  Don&apos;t hardcode API field names — resolve them with{' '}
                  <code className="font-mono text-[0.875em]">explain</code>; the schema is the
                  source of truth.
                </li>
                <li>
                  One proxy per session/scope — restart the proxy after switching accounts or
                  control planes.
                </li>
                <li>
                  Read prices from the machine-readable source (see the{' '}
                  <a href="/llms.txt" className="underline">
                    llms.txt
                  </a>{' '}
                  dev note) rather than scraping prose, so cost decisions stay current.
                </li>
              </ul>
            </SectionBody>
          </Section>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
