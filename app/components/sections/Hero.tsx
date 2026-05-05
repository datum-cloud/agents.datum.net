import { PageContainer } from '../layout/PageContainer';
import { FadeIn } from '../ui/FadeIn';

export function Hero() {
  return (
    <PageContainer>
      <div className="bg-background py-16">
        <FadeIn>
          <h1 className="font-display text-foreground text-[clamp(2.375rem,8vw,5rem)] leading-[1.15] tracking-[-0.0187em]">
            Datum is the
            <br />
            <span className="text-tertiary">open network cloud</span>
            <br />
            for AI.
          </h1>
        </FadeIn>
      </div>
    </PageContainer>
  );
}
