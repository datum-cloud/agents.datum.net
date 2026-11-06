import guide from '@/content/recipes/migrate-from-vercel-to-datum-compute.md?raw';

/**
 * Resource route — serves the Vercel migration recipe as plain markdown at
 * `/recipes/migrate-from-vercel.md`. Same source file as the HTML page, so the
 * two cannot drift apart.
 */
export function loader() {
  return new Response(guide, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  });
}
