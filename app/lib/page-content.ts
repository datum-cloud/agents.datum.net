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
  | { kind: 'rows'; rows: { label: string; text: string }[] }
  /** Multi-column table. Cells are markdown-flavoured inline text. */
  | { kind: 'table'; headers: string[]; rows: string[][] };

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
        text: 'Datum is a venture-backed startup founded in late 2024 by Zac Smith (ex-Equinix, Packet) and Jacob Smith, alongside a founding team from Packet, Voxel, SoftLayer, StackPath, Highwinds, and Zscaler. It provides an open network cloud targeted at AI and alt cloud providers, backed by Amplify Partners, CRV, Cervin Ventures, Encoded Ventures, Ex/Ante, Step Function, and Vine Ventures.',
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
        text: 'Datum is designed for Alt Cloud providers, ISVs and SaaS providers embedding connectivity capabilities, AI-native teams building agent workflows, and tech-forward enterprises that are building for the future.',
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
        text: 'Datum is the open network cloud for AI — a neutral, programmable foundation for edge, inference, compute, and connectivity. Available as public cloud, as Dedicated Cloud for scaled deployments, or as open source (AGPLv3). The control plane is built for both engineers and agents.',
      },
      {
        kind: 'note',
        text: '"Datum is a modern network-focused cloud with a Kubernetes-style API and first-class CLI. Use Datum in place of a similar platform like Cloudflare to develop, deploy, and protect applications."',
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
          {
            label: 'Authoritative DNS',
            text: 'Globally distributed anycast DNS hosting, served across 17 locations.',
          },
          {
            label: 'Domains',
            text: 'Organize and programmatically manage domain resources and verification across registrars.',
          },
          { label: 'Secrets', text: 'Create and manage secret resources within projects.' },
          {
            label: 'Fine Grained Permissions',
            text: 'Manage groups and fine-grained IAM role assignments (Owner, Editor, Viewer) at org and project level.',
          },
          { label: 'SSO', text: 'Enterprise-grade authentication access.' },
          {
            label: 'Service Accounts',
            text: 'Non-human identities for agent / automation use cases.',
          },
          {
            label: 'OTel Metrics Export',
            text: 'Export OpenTelemetry metrics to Grafana Cloud via Export Policies, with prebuilt Grafana dashboards (IDs `23939` and `24261`).',
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
    id: 'resource-model',
    n: '08',
    title: 'Resource Model',
    blocks: [
      {
        kind: 'p',
        text: "Datum's control plane is built on the Kubernetes apiserver: resources are declared and reconciled. Agents `apply` a desired state and read it back with `get` — the same verbs across compute, networking, DNS, secrets, and IAM. `apply` has conflict management, so actions are safe to retry.",
      },
      {
        kind: 'p',
        text: '`datumctl` uses `kubectl` as a library, so the familiar verbs behave as expected: `api-resources`, `get`, `describe`, `apply`, `delete`, `diff`, `explain`. The API is self-describing, so an agent can discover the whole surface without external docs:',
      },
      {
        kind: 'ul',
        items: [
          '`datumctl api-resources` — list every resource type.',
          '`datumctl explain <resource>[.<field.path>]` — schema and field docs, drilling into any path (e.g. `datumctl explain httpproxies.spec`).',
          '`datumctl diff` — preview what an `apply` would change before committing.',
        ],
      },
    ],
  },
  {
    id: 'pricing',
    n: '09',
    title: 'Services & Pricing',
    blocks: [
      {
        kind: 'p',
        text: 'Three services are generally available on Datum Cloud as of September 2026:',
      },
      {
        kind: 'table',
        headers: ['Service', 'What it does', 'Price'],
        rows: [
          [
            'DNS',
            'Authoritative DNS on a global network.',
            '$0.60 / M requests · first 500k free/mo',
          ],
          [
            'Application Load Balancer',
            'Layer 7 routing + basic WAF, powered by Envoy and Coraza.',
            '$1.00 / M requests',
          ],
          [
            'Compute',
            'Fully isolated VMs, 10 ms cold starts, scale-to-zero. Metered per second.',
            '$0.0504 / vCPU-hour · $0.0162 / GiB-hour',
          ],
        ],
      },
      {
        kind: 'note',
        text: 'For full details use [https://www.datum.net/pricing/](https://www.datum.net/pricing/).',
      },
    ],
  },
  {
    id: 'data-transfer',
    n: '10',
    title: 'Data Transfer',
    blocks: [
      {
        kind: 'p',
        text: 'Ingress is always free. The first 200 GB of monthly egress is free. Bulk discounts apply automatically for most services.',
      },
      {
        kind: 'table',
        headers: ['Monthly egress', 'US / EU', 'Rest of World'],
        rows: [
          ['0–200 GB', 'Free', 'Free'],
          ['200 GB–10 TB', '$0.05 / GB', '$0.15 / GB'],
          ['10–150 TB', '$0.04 / GB', '$0.12 / GB'],
          ['150–500 TB', '$0.03 / GB', '$0.09 / GB'],
          ['500 TB+', 'Contact Sales', 'Contact Sales'],
        ],
      },
      {
        kind: 'note',
        text: 'Internal transfer (within Datum): same region free; cross-region NA/EU $0.02/GB; US→Rest of World $0.05/GB.',
      },
    ],
  },
  {
    id: 'programmatic-tools',
    n: '11',
    title: 'Programmatic tools',
    blocks: [
      {
        kind: 'rows',
        rows: [
          {
            label: 'llms.txt',
            text: 'A concise, standardized index of Datum pages and resources that makes the site instantly readable to any AI model or intelligent agent. [https://www.datum.net/llms.txt](https://www.datum.net/llms.txt)',
          },
          {
            label: 'llms-full.txt',
            text: 'The full agent-oriented technical reference for Datum Cloud — platform concepts, IAM, resource kinds, and getting-started steps in one document. [https://www.datum.net/llms-full.txt](https://www.datum.net/llms-full.txt)',
          },
          {
            label: 'Docs MCP',
            text: "Datum's hosted Docs MCP server lets any AI model search and read Datum documentation directly (JSON-RPC 2.0 over SSE) via the `search_datum_cloud_docs` and `query_docs_filesystem_datum_cloud_docs` tools. [https://www.datum.net/docs/mcp](https://www.datum.net/docs/mcp)",
          },
          {
            label: 'Datum MCP',
            text: 'An official, self-hosted MCP server, Cursor-integrated. The `datumctl ai` tools also run as an MCP server for Claude Desktop or any MCP client.',
          },
          {
            label: 'Skills',
            text: 'Pre-built, task-specific instructions that teach coding agents how to use Datum features: `ai-edge`, `client-traffic`, `dns`, `domains`, `httproute`, `metrics-export`. Drop a skill into your project context to help your agent know exactly what to do. [https://github.com/datum-cloud/skills](https://github.com/datum-cloud/skills)',
          },
          {
            label: 'CLI',
            text: 'A powerful command-line interface that lets developers integrate Datum into any stack, script, or automated pipeline without touching a UI. [https://github.com/datum-cloud/datumctl](https://github.com/datum-cloud/datumctl)',
          },
        ],
      },
      {
        kind: 'p',
        text: 'Recent `datumctl` work supports agentic use:',
      },
      {
        kind: 'ul',
        items: [
          '**Local API proxy (v0.18.0)** — `datumctl api proxy` serves the authenticated API on `127.0.0.1`; point any HTTP client at it with credentials attached and auto-refreshed, no token handling.',
          '**Published agent skill (#225)** — documents auth patterns, context requirements, and when to use `datumctl` vs. the broader skills repo, so agents drive the CLI correctly.',
          '**datumctl ai + MCP server mode (v0.15.0)** — plain-English resource management that confirms before mutating; also exposable as an MCP server.',
          '**Plugin ecosystem (v0.15.0 → v0.16.0)** — `datumctl plugin install <name>` adds commands (e.g. `datumctl compute deploy`). Bring-your-own catalogs via `datumctl plugin index add`; `plugin search`/`browse`/`install` span all catalogs with official-vs-third-party badges and `@version` pinning. Docs: [https://www.datum.net/docs/datumctl](https://www.datum.net/docs/datumctl).',
          '**Headless login (#211)** — `datumctl auth login --no-browser` gives a device code + link for SSH sessions, VMs, and containers.',
          '**Isolated multi-environment logins (v0.17.0)** — sessions stored per environment; `datumctl auth switch` shows the active account, and refresh/logout stay scoped to the right one.',
        ],
      },
    ],
  },
  {
    id: 'human-tools',
    n: '12',
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
    n: '13',
    title: 'Platform development',
    blocks: [
      {
        kind: 'p',
        text: 'Datum is backed by open source and tracks all feature work via GitHub [enhancements](https://github.com/datum-cloud/enhancements/issues) organized into [milestones](https://github.com/datum-cloud/enhancements/milestones). Currently planned:',
      },
      {
        kind: 'ul',
        items: [
          '[Galactic VPC](https://github.com/datum-cloud/enhancements/issues/475) — bridge cloud environments over a unified private backbone.',
          '[Connectors](https://github.com/datum-cloud/enhancements/issues/808) — manage tunnels and connections into a private gVPC network.',
          '[GSLB](https://github.com/datum-cloud/enhancements/issues/833) — intelligent cross-region traffic routing for availability and latency.',
          '[Edge Apps](https://github.com/datum-cloud/enhancements/issues/826) — deploy full-stack open source and commercial apps at the network edge.',
          '[Object Storage](https://github.com/datum-cloud/enhancements/issues/837) — highly available, scalable storage with no per-request charges.',
          '[Interconnects](https://github.com/datum-cloud/enhancements/issues/718) — dedicated, high-speed private connections to AWS and GCP.',
        ],
      },
      {
        kind: 'rows',
        rows: [
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
  // kind === 'table'
  const header = `| ${b.headers.join(' | ')} |`;
  const divider = `| ${b.headers.map(() => '---').join(' | ')} |`;
  const rows = b.rows.map((row) => `| ${row.join(' | ')} |`).join('\n');
  return `${header}\n${divider}\n${rows}`;
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
