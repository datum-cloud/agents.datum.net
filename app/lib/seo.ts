import { getPublicEnv } from './env';
import type { MetaDescriptor } from 'react-router';

type SeoOptions = {
  title: string;
  description: string;
  /** Pathname only, joined onto VITE_APP_URL. Defaults to "/". */
  path?: string;
  /** og:type — defaults to "website". */
  type?: 'website' | 'article';
};

/**
 * Build the meta descriptors React Router expects from a single SEO config.
 * Always includes Open Graph, Twitter, and a canonical absolute URL.
 */
export function buildMeta({
  title,
  description,
  path = '/',
  type = 'website',
}: SeoOptions): MetaDescriptor[] {
  const env = getPublicEnv();
  const url = new URL(path, env.VITE_APP_URL).toString();

  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:url', content: url },
    { property: 'og:site_name', content: 'Datum' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { tagName: 'link', rel: 'canonical', href: url },
  ];
}

/**
 * JSON-LD `Organization` payload, returned as a string ready for the
 * <script type="application/ld+json"> tag in the route's meta export.
 */
export function organizationJsonLd(): string {
  const env = getPublicEnv();
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Datum',
    url: env.VITE_MAIN_SITE_URL,
    sameAs: [env.VITE_GITHUB_ORG_URL],
  });
}
