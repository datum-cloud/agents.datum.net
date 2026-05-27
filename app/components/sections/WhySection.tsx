import { SectionFromData } from './SectionFromData';
import { getSection } from '@/lib/page-content';

export function WhySection() {
  return <SectionFromData section={getSection('why')} />;
}
