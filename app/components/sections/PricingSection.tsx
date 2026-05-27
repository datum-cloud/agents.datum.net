import { SectionFromData } from './SectionFromData';
import { getSection } from '@/lib/page-content';

export function PricingSection() {
  return <SectionFromData section={getSection('pricing')} />;
}
