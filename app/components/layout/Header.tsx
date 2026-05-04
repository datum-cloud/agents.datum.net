import { PageContainer } from './PageContainer';
import { Icon } from '@/components/Icon';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { getPublicEnv } from '@/lib/env';

/**
 * Top navbar from the Figma design: brand mark + tagline on the left, link
 * back to datum.net plus Sign in / Start for free on the right. Sticks to the
 * design's 80px height with a 1px fjord baseline.
 */
export function Header() {
  const env = getPublicEnv();

  return (
    <header className="bg-background">
      <PageContainer>
        <div className="border-foreground dark:border-border flex h-20 items-center gap-10 border-b">
          <a href={env.VITE_MAIN_SITE_URL} className="flex items-center gap-8" aria-label="Datum">
            <div className="bg-midnight-fjord flex size-8 shrink-0 items-center justify-center">
              <Icon
                name="datum-logo"
                size="md"
                className="text-glacier-mist-700 dark:text-primary"
              />
            </div>
            <span className="text-foreground hidden text-[14px] leading-[21px] whitespace-nowrap md:inline">
              Built to help AI agents work better with Datum
            </span>
          </a>

          <div className="flex-1" />

          <nav className="flex items-center gap-3.5">
            <a
              href={env.VITE_MAIN_SITE_URL}
              target="_blank"
              rel="noreferrer"
              className="text-foreground hover:bg-muted focus-visible:bg-muted group hidden items-center gap-3 rounded-md px-5 py-3.5 text-[14px] leading-[21px] transition-colors md:inline-flex">
              <span>
                Are you human? Head to <span className="underline">Datum.net</span>
              </span>
              <Icon
                name="external-link"
                size="sm"
                className="dark:text-primary shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
            <ButtonLink href={`${env.VITE_PORTAL_URL}/login`} variant="ghost">
              Sign in
            </ButtonLink>
            <ButtonLink href={`${env.VITE_PORTAL_URL}/signup`} variant="primary">
              Start for free
            </ButtonLink>
          </nav>
        </div>
      </PageContainer>
    </header>
  );
}
