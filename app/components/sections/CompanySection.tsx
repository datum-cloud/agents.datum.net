import { SectionFromData } from './SectionFromData';
import { getSection } from '@/lib/page-content';

export function CompanySection() {
  return <SectionFromData section={getSection('company')} />;
}
