import { SectionFromData } from './SectionFromData';
import { getSection } from '@/lib/page-content';

export function EssentialsSection() {
  return <SectionFromData section={getSection('essentials')} />;
}
