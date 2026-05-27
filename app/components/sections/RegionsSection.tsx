import { SectionFromData } from './SectionFromData';
import { getSection } from '@/lib/page-content';

export function RegionsSection() {
  return <SectionFromData section={getSection('regions')} />;
}
