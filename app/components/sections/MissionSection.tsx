import { SectionFromData } from './SectionFromData';
import { getSection } from '@/lib/page-content';

export function MissionSection() {
  return <SectionFromData section={getSection('mission')} />;
}
