import { SectionFromData } from './SectionFromData';
import { getSection } from '@/lib/page-content';

export function ProductSection() {
  return <SectionFromData section={getSection('product')} />;
}
