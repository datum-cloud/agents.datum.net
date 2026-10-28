import { SectionFromData } from './SectionFromData';
import { getSection } from '@/lib/page-content';

export function UseCasesSection() {
  return <SectionFromData section={getSection('use-cases')} />;
}
