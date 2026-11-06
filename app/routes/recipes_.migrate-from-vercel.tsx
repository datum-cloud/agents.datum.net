import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Markdown } from '@/components/ui/Markdown';
import guide from '@/content/recipes/migrate-from-vercel-to-datum-compute.md?raw';
import { buildMeta } from '@/lib/seo';
import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = ({ matches }) => {
  const parentMeta = matches.flatMap((match) => match.meta ?? []);
  return [
    ...parentMeta,
    ...buildMeta({
      title: 'Datum — Recipe: Migrate from Vercel to Datum Compute',
      description:
        'Move a Node SSR app from Vercel to a Datum Compute workload: containerize, secrets, deploy, custom domain, CI and rollback, with verified and untested steps marked.',
      path: '/recipes/migrate-from-vercel',
      type: 'article',
    }),
  ];
};

export default function MigrateFromVercelRecipe() {
  return (
    <>
      <Header />
      <main id="main" className="bg-background text-foreground min-h-dvh">
        <PageContainer className="py-16">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="/recipes" className="md-trigger">
              <span aria-hidden="true" className="md-trigger__arrow">
                ←
              </span>
              <span>Back to recipes</span>
            </a>
            <a href="/recipes/migrate-from-vercel.md" className="md-trigger">
              <span>View as markdown</span>
            </a>
          </div>
          <article className="max-w-[var(--section-content-max)]">
            <Markdown>{guide}</Markdown>
          </article>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
