import { getPublicEnv } from './env';
import type { MetaDescriptor } from 'react-router';

const OG_IMAGE_PATH = '/og-image.png';

type SeoOptions = {
  title: string;
  description: string;
  /** Falls back to title when omitted. */
  ogTitle?: string;
  /** Falls back to description when omitted. */
  ogDescription?: string;
  /** Pathname only, joined onto VITE_APP_URL. Defaults to "/". */
  path?: string;
  /** og:type — defaults to "website". */
  type?: 'website' | 'article';
  /** Absolute URL to the OG/Twitter share image. Defaults to datum.net hero image. */
  image?: string;
};

/**
 * Build the meta descriptors React Router expects from a single SEO config.
 * Always includes Open Graph, Twitter Card (large image), and a canonical URL.
 */
export function buildMeta({
  title,
  description,
  ogTitle,
  ogDescription,
  path = '/',
  type = 'website',
  image,
}: SeoOptions): MetaDescriptor[] {
  const env = getPublicEnv();
  const url = new URL(path, env.VITE_APP_URL).toString();
  const resolvedImage = image ?? new URL(OG_IMAGE_PATH, env.VITE_APP_URL).toString();
  const resolvedOgTitle = ogTitle ?? title;
  const resolvedOgDescription = ogDescription ?? description;

  return [
    { title },
    { name: 'description', content: description },
    { name: 'robots', content: 'index, follow' },

    // Open Graph
    { property: 'og:title', content: resolvedOgTitle },
    { property: 'og:description', content: resolvedOgDescription },
    { property: 'og:type', content: type },
    { property: 'og:url', content: url },
    { property: 'og:site_name', content: 'Datum' },
    { property: 'og:locale', content: 'en_US' },
    { property: 'og:image', content: resolvedImage },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@datumcloud' },
    { name: 'twitter:creator', content: '@datumcloud' },
    { name: 'twitter:title', content: resolvedOgTitle },
    { name: 'twitter:description', content: resolvedOgDescription },
    { name: 'twitter:image', content: resolvedImage },
    { name: 'twitter:url', content: url },

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
    '@id': `${env.VITE_APP_URL}/#organization`,
    name: 'Datum',
    legalName: 'Datum Technology, Inc.',
    url: env.VITE_MAIN_SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.datum.net/datum-light.svg',
    },
    description:
      'Datum is an open, neutral, global network cloud that is built for AI and focused on giving alternative cloud providers critical network infrastructure to compete at scale, no networking team required!',
    foundingDate: '2024',
    founder: [
      { '@type': 'Person', name: 'Zac Smith' },
      { '@type': 'Person', name: 'Jacob Smith' },
    ],
    sameAs: [
      env.VITE_GITHUB_ORG_URL,
      'https://www.youtube.com/@Datum-Cloud',
      'https://www.linkedin.com/company/datum-cloud',
      'https://twitter.com/datumcloud',
    ],
  });
}
