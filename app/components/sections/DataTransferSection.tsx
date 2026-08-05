import { SectionFromData } from './SectionFromData';
import { getSection } from '@/lib/page-content';

export function DataTransferSection() {
  return <SectionFromData section={getSection('data-transfer')} />;
}
