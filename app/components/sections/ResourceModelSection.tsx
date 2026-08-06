import { SectionFromData } from './SectionFromData';
import { getSection } from '@/lib/page-content';

export function ResourceModelSection() {
  return <SectionFromData section={getSection('resource-model')} />;
}
