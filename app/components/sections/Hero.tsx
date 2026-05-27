import { PageContainer } from '../layout/PageContainer';
import { FadeIn } from '../ui/FadeIn';
import { TerminalLink } from '../ui/TerminalLink';
import { HERO } from '@/lib/page-content';

export function Hero() {
  return (
    <PageContainer>
      <div className="bg-background py-16">
        <FadeIn>
          <h1 className="font-display text-foreground text-[clamp(2.375rem,8vw,5rem)] leading-[1.15] tracking-[-0.0187em]">
            {HERO.prefix}
            <br />
            <span className="text-tertiary">{HERO.emphasis}</span>
            <br />
            {HERO.suffix}
          </h1>

          <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <TerminalLink href="/index.md" title="$ cat /index.md" className="md-trigger">
              <span>Read as Markdown</span>
              <span aria-hidden="true" className="md-trigger__arrow">
                ↓
              </span>
            </TerminalLink>
            <span aria-hidden="true" className="text-foreground/30 font-mono text-[10px]">
              /
            </span>
            <TerminalLink href="/llms.txt" title="$ cat /llms.txt" className="md-trigger">
              <span>llms.txt</span>
              <span aria-hidden="true" className="md-trigger__arrow">
                ↗
              </span>
            </TerminalLink>
          </p>
        </FadeIn>
      </div>
    </PageContainer>
  );
}
