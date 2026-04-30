import { Button } from '@datum-cloud/datum-ui/button';
import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = ({ matches }) => {
  const parentMeta = matches.flatMap((match) => match.meta ?? []);
  return [
    ...parentMeta,
    { title: 'Datum — Cloud infrastructure for the agentic era' },
    {
      property: 'og:title',
      content: 'Datum — Cloud infrastructure for the agentic era',
    },
    {
      property: 'og:description',
      content:
        'A surface designed for both AI agents and humans. Datum builds cloud infrastructure for the agentic era.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://agents.datum.net' },
    { name: 'twitter:card', content: 'summary' },
  ];
};

export default function Home() {
  return (
    <main id="main" className="bg-background text-foreground min-h-dvh">
      <div className="mx-auto max-w-[var(--container-content)] px-6 py-24">
        <p className="text-muted-foreground font-mono text-xs">00 / scaffold</p>
        <h1 className="mt-3 text-2xl leading-[var(--leading-heading)] font-medium tracking-tight">
          agents.datum.net
        </h1>
        <p className="text-muted-foreground mt-6 leading-[var(--leading-body)]">
          Phase 1 scaffold. The page uses{' '}
          <code className="text-foreground font-mono text-sm">@datum-cloud/datum-ui</code>{' '}
          components and tokens. Theme follows the OS via{' '}
          <code className="text-foreground font-mono text-sm">prefers-color-scheme</code>. Default
          is light; switch your system appearance to dark to flip the page live with no reload.
        </p>

        <hr className="border-border my-10" />

        <div className="flex flex-wrap gap-3">
          <Button type="primary" theme="solid">
            Primary
          </Button>
          <Button type="primary" theme="outline">
            Outline
          </Button>
          <Button type="primary" theme="link">
            Link
          </Button>
        </div>

        <ul className="text-muted-foreground mt-10 space-y-2 text-sm">
          <li>
            <span className="text-foreground font-medium">background</span>:{' '}
            <span className="bg-background border-border inline-block h-3 w-3 rounded-sm border align-middle" />
          </li>
          <li>
            <span className="text-foreground font-medium">foreground</span>:{' '}
            <span className="bg-foreground inline-block h-3 w-3 rounded-sm align-middle" />
          </li>
          <li>
            <span className="text-foreground font-medium">primary</span>:{' '}
            <span className="bg-primary inline-block h-3 w-3 rounded-sm align-middle" />
          </li>
        </ul>
      </div>
    </main>
  );
}
