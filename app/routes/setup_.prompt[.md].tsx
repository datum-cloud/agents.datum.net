import prompt from '@/content/setup/prompt.md?raw';

/**
 * Resource route — serves the agent setup instructions as plain markdown at
 * `/setup/prompt.md`. This is the URL users paste into their coding agent
 * (the cloud portal's "Onboard your agent" button copies a sentence pointing
 * here). Same source file as the `/setup` HTML page, so the two cannot drift.
 */
export function loader() {
  return new Response(prompt, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  });
}
