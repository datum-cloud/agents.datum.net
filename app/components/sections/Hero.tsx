import { PageContainer } from '../layout/PageContainer';

/**
 * Page hero. The single <h1> is split across three lines per Figma; the middle
 * line is rendered in pine-forge to mirror the design's color emphasis. The
 * Canela display face comes from `font-display`.
 */
export function Hero() {
  return (
    <PageContainer>
      <div className="bg-glacier-mist-700 py-16">
        <h1 className="font-display text-midnight-fjord text-[clamp(2.375rem,8vw,5rem)] leading-[1.15] tracking-[-0.0187em]">
          Datum is the
          <br />
          <span className="text-pine-forge">Open Network Cloud</span>
          <br />
          for AI.
        </h1>
      </div>
    </PageContainer>
  );
}
