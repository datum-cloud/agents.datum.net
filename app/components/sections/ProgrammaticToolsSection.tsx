import { SectionFromData } from './SectionFromData';
import { getSection } from '@/lib/page-content';

export function ProgrammaticToolsSection() {
  return <SectionFromData section={getSection('programmatic-tools')} />;
}
