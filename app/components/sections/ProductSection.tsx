import { Section } from '../layout/Section';
import { SectionBody } from '../layout/SectionBody';

export function ProductSection() {
  return (
    <Section id="product" n="05" title="Product">
      <SectionBody>
        <p>
          Datum operates a global network cloud that is fully programmatic, built for AI, and
          available via four deployment models: public cloud, dedicated cloud, bring your own (BYO)
          cloud, or full open source under an AGPLv3 license.
        </p>
        <p>Core features include:</p>
        <ul className="flex flex-col gap-2">
          <li>
            <strong className="font-semibold">AI Edge</strong> — Internet scale to zero edge
            compute, powered by Tetrate Enterprise Envoy.
          </li>
          <li>
            <strong className="font-semibold">Inference</strong> — A low latency, production ready
            agent routing service, powered by Tetrate.
          </li>
          <li>
            <strong className="font-semibold">Compute</strong> — Isolated, millisecond cold start
            and scale to zero compute at the edge, powered by Unikraft.
          </li>
          <li>
            <strong className="font-semibold">Connectivity</strong> — Deterministic, high
            performance and private connectivity from edge to cloud.
          </li>
        </ul>
      </SectionBody>
    </Section>
  );
}
