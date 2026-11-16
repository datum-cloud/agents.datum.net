import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Markdown } from '@/components/ui/Markdown';
import prompt from '@/content/setup/prompt.md?raw';
import { buildMeta } from '@/lib/seo';
import type { MetaFunction } from 'react-router';

const SETUP_PROMPT =
  'Fetch and execute the appropriate instructions to set me up for Datum Cloud from https://agents.datum.net/setup/prompt.md';

export const meta: MetaFunction = ({ matches }) => {
  const parentMeta = matches.flatMap((match) => match.meta ?? []);
  return [
    ...parentMeta,
    ...buildMeta({
      title: 'Datum — Set up your agent',
      description:
        'One prompt that sets up a coding agent for Datum Cloud: datumctl and its plugins, the Datum MCP and Docs MCP servers, Datum skills, and sign-in.',
      path: '/setup',
      type: 'article',
    }),
  ];
};

export default function AgentSetup() {
  return (
    <>
      <Header />
      <main id="main" className="bg-background text-foreground min-h-dvh">
        <PageContainer className="py-16">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="/" className="md-trigger">
              <span aria-hidden="true" className="md-trigger__arrow">
                ←
              </span>
              <span>Back to agents.datum.net</span>
            </a>
            <a href="/setup/prompt.md" className="md-trigger">
              <span>View as markdown</span>
            </a>
          </div>
          <div className="mt-6 flex max-w-[var(--section-content-max)] flex-col gap-4">
            <p className="text-foreground/70 text-[16px] leading-[24px]">
              Paste this into Claude Code, Codex, Cursor, GitHub Copilot, OpenCode, Windsurf or any
              other coding agent. It follows the instructions below to set itself up for Datum
              Cloud.
            </p>
            <pre className="bg-muted border-border text-foreground rounded-md border p-4 font-mono text-[13px] leading-[1.6] break-words whitespace-pre-wrap">
              <code>{SETUP_PROMPT}</code>
            </pre>
          </div>
          <article className="mt-8 max-w-[var(--section-content-max)]">
            <Markdown>{prompt}</Markdown>
          </article>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
