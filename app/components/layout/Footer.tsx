import { PageContainer } from './PageContainer';
import { Icon } from '@/components/Icon';
import { getPublicEnv } from '@/lib/env';

/**
 * Page footer from the Figma design: tagline link on the left mirroring the
 * navbar's "Are you human?" pattern, social cluster + copyright on the right.
 * 1px fjord top border seals the page off from the last numbered section.
 */
export function Footer() {
  const env = getPublicEnv();
  const year = new Date().getFullYear();

  return (
    <footer className="border-midnight-fjord bg-glacier-mist-700 border-t py-2.5">
      <PageContainer>
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <a
            href={env.VITE_MAIN_SITE_URL}
            target="_blank"
            rel="noreferrer"
            className="text-midnight-fjord hover:bg-glacier-mist-800 focus-visible:bg-glacier-mist-800 inline-flex items-center gap-3 rounded-md px-5 py-3.5 text-[14px] leading-[21px] transition-colors">
            <span>
              Are you human? Head to <span className="underline">Datum.net</span>
            </span>
            <Icon name="external-link" size="sm" className="shrink-0" />
          </a>

          <div className="flex w-full items-center justify-between gap-10 md:w-auto">
            <ul className="flex items-center gap-2.5">
              <li className="flex items-center">
                <a
                  href={env.VITE_DISCORD_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Datum on Discord"
                  className="text-app-dark-utility-3 hover:text-midnight-fjord focus-visible:text-midnight-fjord inline-flex items-center justify-center transition-colors">
                  <Icon name="discord" size="md" />
                </a>
              </li>
              <li className="flex items-center">
                <a
                  href={env.VITE_YOUTUBE_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Datum on YouTube"
                  className="text-app-dark-utility-3 hover:text-midnight-fjord focus-visible:text-midnight-fjord inline-flex items-center justify-center transition-colors">
                  <Icon name="youtube" size="md" />
                </a>
              </li>
              <li className="flex items-center">
                <a
                  href={env.VITE_LINKEDIN_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Datum on LinkedIn"
                  className="text-app-dark-utility-3 hover:text-midnight-fjord focus-visible:text-midnight-fjord inline-flex items-center justify-center transition-colors">
                  <Icon name="linkedin" size="md" />
                </a>
              </li>
            </ul>
            <p className="text-midnight-fjord/40 text-right text-[12px] leading-[16px] whitespace-nowrap">
              © {year} Datum Technology Inc.
            </p>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}
