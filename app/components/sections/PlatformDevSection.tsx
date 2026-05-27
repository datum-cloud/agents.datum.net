import { SectionFromData } from './SectionFromData';
import { getSection } from '@/lib/page-content';

export function PlatformDevSection() {
  return <SectionFromData section={getSection('platform-development')} />;
}
