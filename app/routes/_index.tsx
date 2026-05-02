import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { CompanySection } from '@/components/sections/CompanySection';
import { CustomersSection } from '@/components/sections/CustomersSection';
import { EssentialsSection } from '@/components/sections/EssentialsSection';
import { Hero } from '@/components/sections/Hero';
import { HumanToolsSection } from '@/components/sections/HumanToolsSection';
import { MissionSection } from '@/components/sections/MissionSection';
import { PlatformDevSection } from '@/components/sections/PlatformDevSection';
import { PricingSection } from '@/components/sections/PricingSection';
import { ProductSection } from '@/components/sections/ProductSection';
import { ProgrammaticToolsSection } from '@/components/sections/ProgrammaticToolsSection';
import { RegionsSection } from '@/components/sections/RegionsSection';
import { WhySection } from '@/components/sections/WhySection';
import { buildMeta, organizationJsonLd } from '@/lib/seo';
import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = ({ matches }) => {
  const parentMeta = matches.flatMap((match) => match.meta ?? []);
  return [
    ...parentMeta,
    ...buildMeta({
      title: 'Datum — Open Network Cloud for AI',
      description:
        'Datum is an open network cloud built for AI agents and modern providers. A surface designed for both AI agents and humans.',
      path: '/',
    }),
  ];
};

export default function Home() {
  return (
    <>
      {/* JSON-LD must be an inline <script> in JSX — React Router meta() only
          accepts <link> and <meta> elements, not <script> tags. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: organizationJsonLd() }}
      />
      <Header />
      <main id="main" className="bg-background text-foreground min-h-dvh">
        <Hero />
        <PageContainer>
          <CompanySection />
          <MissionSection />
          <WhySection />
          <CustomersSection />
          <ProductSection />
          <EssentialsSection />
          <RegionsSection />
          <PricingSection />
          <ProgrammaticToolsSection />
          <HumanToolsSection />
          <PlatformDevSection />
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
