import { SectionFromData } from './SectionFromData';
import { getSection } from '@/lib/page-content';

export function CustomersSection() {
  return <SectionFromData section={getSection('customers')} />;
}
