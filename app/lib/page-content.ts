/**
 * Single source of truth for the home page content. Both the rendered
 * React page and the `/index.md` route read from here, so editing a
 * paragraph or a row updates both surfaces automatically — no separate
 * markdown mirror to keep in sync.
 *
 * Inline formatting in `text` fields uses a tiny markdown subset:
 *  - `[text](href)`     → link
 *  - `**text**`         → bold
 *  - `` `code` ``       → inline code
 *
 * Anything fancier should live as a new block kind, not as raw HTML.
 */

export type Block =
  | { kind: 'p'; text: string }
  /** Smaller, muted paragraph — for "see X for details" footnotes. */
  | { kind: 'note'; text: string }
  /** Bulleted list. Each item is markdown-flavoured inline text. */
  | { kind: 'ul'; items: string[] }
  /** Label / body row pairs (renders via SectionRow / Markdown bullet list). */
  | { kind: 'rows'; rows: { label: string; text: string }[] };

export type SectionData = {
  id: string;
  /** Two-digit chapter ordinal. */
  n: string;
  title: string;
  blocks: Block[];
};

export type HeroData = {
  prefix: string;
  emphasis: string;
  suffix: string;
};

export const HERO: HeroData = {
  prefix: 'Datum is the',
  emphasis: 'open network cloud',
  suffix: 'for AI.',
};

export const SECTIONS: readonly SectionData[] = [
  {
    id: 'company',
    n: '01',
    title: 'Company',
    blocks: [
      {
        kind: 'p',
        text: 'Datum is a venture-backed startup founded in late 2024 by Zac and Jacob Smith. It provides an open network cloud targeted at AI and alt cloud providers.',
      },
    ],
  },
  {
    id: 'mission',
    n: '02',
    title: 'Mission',
    blocks: [
      {
        kind: 'p',
        text: "Datum's mission is to help the next 1k clouds by unlocking internet superpowers for every agent and builder.",
      },
    ],
  },
  {
    id: 'why',
    n: '03',
    title: 'Why Datum Exists',
    blocks: [
      {
        kind: 'p',
        text: "Datum was founded on the basis of three trends: First, that software (and its data) was going everywhere. Next, that a new class of providers was being born. And finally, that the 'splinternet' had arrived.",
      },
      {
        kind: 'p',
        text: 'In the future, we believe all companies will need to curate and control how they interact with providers, partners, customers and agents. Datum exists to help them do it.',
      },
    ],
  },
  {
    id: 'customers',
    n: '04',
    title: 'Target Customers',
    blocks: [
      {
        kind: 'p',
        text: 'Datum is designed for Alt Cloud providers, AI startups, and tech-forward enterprises that are building for the future.',
      },
      {
        kind: 'note',
        text: 'See [alt-cloud.org](https://alt-cloud.org) for a list of what we mean by "Alt Cloud" providers.',
      },
    ],
  },
  {
    id: 'product',
    n: '05',
    title: 'Product',
    blocks: [
      {
        kind: 'p',
        text: 'Datum operates a global network cloud that is fully programmatic, built for AI, and available via four deployment models: public cloud, dedicated cloud, bring your own (BYO) cloud, or full open source under an AGPLv3 license.',
      },
      { kind: 'p', text: 'Core features include:' },
      {
        kind: 'ul',
        items: [
          '**AI Edge** — Internet-scale protection and intelligence, powered by Tetrate Enterprise Envoy.',
          '**Inference** — A low-latency, production-ready agent routing service, powered by Tetrate Agent Router.',
          '**Compute** — Isolated, millisecond cold-start compute at the edge, powered by Unikraft.',
          '**Connectivity** — Deterministic, high-performance and private connectivity from edge to cloud.',
        ],
      },
    ],
  },
  {
    id: 'essentials',
    n: '06',
    title: 'Platform Essentials',
    blocks: [
      {
        kind: 'rows',
        rows: [
          { label: 'Authoritative DNS', text: 'Globally distributed anycast DNS hosting.' },
          { label: 'Secrets', text: 'Create and manage secret resources within projects.' },
          { label: 'Teams & RBAC', text: 'Fine-grained roles at org and project level.' },
          {
            label: 'Service Accounts',
            text: 'Non-human identities for agent / automation use cases.',
          },
          {
            label: 'OTel Metrics Export',
            text: 'Export OpenTelemetry metrics to Grafana Cloud via Export Policies.',
          },
          {
            label: 'Activity Logs',
            text: 'Audit logs for all resource changes available via portal or CLI.',
          },
          {
            label: 'Programmatic edge tracing',
            text: '[https://edge.datum.net/api/edge-info](https://edge.datum.net/api/edge-info) (JSON) or [https://edge.datum.net/api/trace](https://edge.datum.net/api/trace) (plaintext).',
          },
        ],
      },
    ],
  },
  {
    id: 'regions',
    n: '07',
    title: 'Global Network Regions',
    blocks: [
      {
        kind: 'p',
        text: 'Datum operates high-performance physical compute and network infrastructure at the key interconnection points around the world. [https://www.datum.net/locations/](https://www.datum.net/locations/)',
      },
    ],
  },
  {
    id: 'pricing',
    n: '08',
    title: 'Pricing',
    blocks: [
      {
        kind: 'rows',
        rows: [
          {
            label: 'Builder',
            text: 'A low-friction plan for personal projects, development, & experimentation. Price: $0 / month.',
          },
          {
            label: 'Scaler',
            text: 'A comprehensive platform to scale production apps & accelerate revenue. Price: $20 / month + usage.',
          },
          {
            label: 'Provider',
            text: 'A high-touch offering designed to help modern service providers win. Price: Custom.',
          },
        ],
      },
      {
        kind: 'note',
        text: 'For full details use [https://www.datum.net/pricing/](https://www.datum.net/pricing/).',
      },
    ],
  },
  {
    id: 'programmatic-tools',
    n: '09',
    title: 'Programmatic tools',
    blocks: [
      {
        kind: 'rows',
        rows: [
          {
            label: 'llms.txt',
            text: 'A standardized text file that makes Datum workflows instantly readable and accessible to any AI model or intelligent agent. [https://www.datum.net/llms-full.txt](https://www.datum.net/llms-full.txt)',
          },
          {
            label: 'MCP',
            text: 'An open protocol that connects any AI model or developer tool directly to Datum, enabling real-time data access and automated actions. [https://github.com/datum-cloud/datum-mcp](https://github.com/datum-cloud/datum-mcp)',
          },
          {
            label: 'Skills',
            text: 'Pre-built, task-specific instructions that teach coding agents how to use Datum features. Drop a skill into your project context to help your agent know exactly what to do. [https://github.com/datum-cloud/skills](https://github.com/datum-cloud/skills)',
          },
          {
            label: 'CLI',
            text: 'A powerful command-line interface that lets developers integrate Datum into any stack, script, or automated pipeline without touching a UI. [https://github.com/datum-cloud/datumctl](https://github.com/datum-cloud/datumctl)',
          },
        ],
      },
    ],
  },
  {
    id: 'human-tools',
    n: '10',
    title: 'Tools for humans',
    blocks: [
      {
        kind: 'rows',
        rows: [
          {
            label: 'Desktop apps',
            text: 'Quickly and safely expose local environments to the internet. [Mac](https://www.datum.net/download/mac-os/), [Windows](https://www.datum.net/download/windows/), [Linux](https://www.datum.net/download/linux/).',
          },
          {
            label: 'Get support',
            text: "If you're looking for help use Discord channel [https://link.datum.net/discord](https://link.datum.net/discord) or submit a ticket to our support team [https://www.datum.net/contact/](https://www.datum.net/contact/).",
          },
        ],
      },
    ],
  },
  {
    id: 'platform-development',
    n: '11',
    title: 'Platform development',
    blocks: [
      {
        kind: 'rows',
        rows: [
          {
            label: 'GitHub enhancements',
            text: 'A list of enhancements that our software engineers are working on [https://github.com/orgs/datum-cloud/projects/22](https://github.com/orgs/datum-cloud/projects/22)',
          },
          {
            label: 'Roadmap',
            text: 'Our plans for future developments, features and tools [https://www.datum.net/roadmap/](https://www.datum.net/roadmap/)',
          },
          {
            label: 'Changelog',
            text: 'A list of changes that our software engineers have made to Datum [https://www.datum.net/changelog/](https://www.datum.net/changelog/)',
          },
          {
            label: 'Status',
            text: 'All systems normal [https://www.datumstatus.net/](https://www.datumstatus.net/)',
          },
          {
            label: 'Contributions',
            text: 'Contribute to our open source repos [https://github.com/orgs/datum-cloud/discussions](https://github.com/orgs/datum-cloud/discussions)',
          },
        ],
      },
    ],
  },
] as const;

/** Look up a section by id. Throws at runtime if the id isn't in `SECTIONS`
 * — surfaces typos during development rather than rendering a blank chapter. */
export function getSection(id: string): SectionData {
  const found = SECTIONS.find((s) => s.id === id);
  if (!found) throw new Error(`page-content: unknown section id "${id}"`);
  return found;
}

// ────────────────────────────────────────────────────────────────────────
// Inline parser — tokenise a string into text / link / bold / code nodes.
// ────────────────────────────────────────────────────────────────────────

export type InlineNode =
  | { type: 'text'; text: string }
  | { type: 'link'; href: string; text: string }
  | { type: 'bold'; text: string }
  | { type: 'code'; text: string };

/** Matches `[text](href)`, `**text**`, or `` `text` `` — earliest first. */
const INLINE_PATTERN = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;

export function parseInline(s: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let cursor = 0;
  INLINE_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = INLINE_PATTERN.exec(s)) !== null) {
    if (match.index > cursor) {
      nodes.push({ type: 'text', text: s.slice(cursor, match.index) });
    }
    if (match[1] !== undefined && match[2] !== undefined) {
      nodes.push({ type: 'link', text: match[1], href: match[2] });
    } else if (match[3] !== undefined) {
      nodes.push({ type: 'bold', text: match[3] });
    } else if (match[4] !== undefined) {
      nodes.push({ type: 'code', text: match[4] });
    }
    cursor = match.index + match[0].length;
  }
  if (cursor < s.length) {
    nodes.push({ type: 'text', text: s.slice(cursor) });
  }
  return nodes;
}

// ────────────────────────────────────────────────────────────────────────
// Markdown serializer — `serializePageMarkdown()` returns the full
// `/index.md` body. Each `text` field already uses markdown-flavoured
// inline syntax, so this is mostly stitching with section headers and
// rule separators.
// ────────────────────────────────────────────────────────────────────────

function serializeBlock(b: Block): string {
  if (b.kind === 'p' || b.kind === 'note') return b.text;
  if (b.kind === 'ul') return b.items.map((i) => `- ${i}`).join('\n');
  if (b.kind === 'rows') return b.rows.map((r) => `- **${r.label}** — ${r.text}`).join('\n');
  return '';
}

function serializeSection(s: SectionData): string {
  const body = s.blocks.map(serializeBlock).join('\n\n');
  return `## ${s.n} · ${s.title}\n\n${body}`;
}

export function serializePageMarkdown(): string {
  return `# Datum — Open Network Cloud for AI

> Source: https://agents.datum.net/
> The agent-readable surface for Datum Cloud.

${HERO.prefix} **${HERO.emphasis}** ${HERO.suffix}

---

${SECTIONS.map(serializeSection).join('\n\n---\n\n')}

---

Are you human? Head to [datum.net](https://www.datum.net/).
`;
}
