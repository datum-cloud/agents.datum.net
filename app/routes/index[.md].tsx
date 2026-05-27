import { serializePageMarkdown } from '@/lib/page-content';

/**
 * Resource route — serves the home page as plain markdown at `/index.md`.
 * No React component is exported; the loader returns a Response directly.
 *
 * Content is generated on demand from `page-content.ts` (the same module
 * the React page renders from), so the markdown export stays in sync with
 * the live page automatically — no manual mirror to maintain.
 *
 * Cached aggressively because the content only changes when we ship.
 */
export function loader() {
  return new Response(serializePageMarkdown(), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  });
}
