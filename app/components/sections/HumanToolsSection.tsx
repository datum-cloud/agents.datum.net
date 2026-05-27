import { SectionFromData } from './SectionFromData';
import { getSection } from '@/lib/page-content';

export function HumanToolsSection() {
  return <SectionFromData section={getSection('human-tools')} />;
}
