import './styles/globals.css';
import { ThemeProvider, ThemeScript } from '@datum-cloud/datum-ui/theme';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import type { LinksFunction, MetaFunction } from 'react-router';

export const links: LinksFunction = () => [
  // SVG — handles all modern browsers natively, colour via CSS
  // { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },

  // PNG fallbacks — light/dark via media query
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/favicons/favicon-light-16x16.png',
    media: '(prefers-color-scheme: light)',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: '/favicons/favicon-light-32x32.png',
    media: '(prefers-color-scheme: light)',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '96x96',
    href: '/favicons/favicon-light-96x96.png',
    media: '(prefers-color-scheme: light)',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '128x128',
    href: '/favicons/favicon-light-128x128.png',
    media: '(prefers-color-scheme: light)',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '196x196',
    href: '/favicons/favicon-light-196x196.png',
    media: '(prefers-color-scheme: light)',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/favicons/favicon-dark-16x16.png',
    media: '(prefers-color-scheme: dark)',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: '/favicons/favicon-dark-32x32.png',
    media: '(prefers-color-scheme: dark)',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '96x96',
    href: '/favicons/favicon-dark-96x96.png',
    media: '(prefers-color-scheme: dark)',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '128x128',
    href: '/favicons/favicon-dark-128x128.png',
    media: '(prefers-color-scheme: dark)',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '196x196',
    href: '/favicons/favicon-dark-196x196.png',
    media: '(prefers-color-scheme: dark)',
  },

  // Apple touch icons
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: '/favicons/_misc/apple-touch-icon-180x180.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '167x167',
    href: '/favicons/_misc/apple-touch-icon-167x167.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '152x152',
    href: '/favicons/_misc/apple-touch-icon-152x152.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '144x144',
    href: '/favicons/_misc/apple-touch-icon-144x144.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '120x120',
    href: '/favicons/_misc/apple-touch-icon-120x120.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '114x114',
    href: '/favicons/_misc/apple-touch-icon-114x114.png',
  },
  { rel: 'apple-touch-icon', sizes: '76x76', href: '/favicons/_misc/apple-touch-icon-76x76.png' },
  { rel: 'apple-touch-icon', sizes: '72x72', href: '/favicons/_misc/apple-touch-icon-72x72.png' },
  { rel: 'apple-touch-icon', sizes: '60x60', href: '/favicons/_misc/apple-touch-icon-60x60.png' },
  { rel: 'apple-touch-icon', sizes: '57x57', href: '/favicons/_misc/apple-touch-icon-57x57.png' },

  // Android / PWA
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '192x192',
    href: '/favicons/_misc/android-chrome-192x192.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '512x512',
    href: '/favicons/_misc/android-chrome-512x512.png',
  },
];

export const meta: MetaFunction = () => [
  { charSet: 'utf-8' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  { name: 'color-scheme', content: 'light dark' },
  {
    tagName: 'meta',
    name: 'theme-color',
    content: '#ffffff',
    media: '(prefers-color-scheme: light)',
  },
  {
    tagName: 'meta',
    name: 'theme-color',
    content: '#0a0a0a',
    media: '(prefers-color-scheme: dark)',
  },
  { name: 'description', content: 'Datum is cloud infrastructure for the agentic era.' },

  // Windows tiles
  {
    tagName: 'meta',
    name: 'msapplication-TileImage',
    content: '/favicons/_misc/mstile-144x144.png',
  },
  { tagName: 'meta', name: 'msapplication-TileColor', content: '#0c1d31' },
  {
    tagName: 'meta',
    name: 'msapplication-square70x70logo',
    content: '/favicons/_misc/mstile-70x70.png',
  },
  {
    tagName: 'meta',
    name: 'msapplication-square150x150logo',
    content: '/favicons/_misc/mstile-150x150.png',
  },
  {
    tagName: 'meta',
    name: 'msapplication-wide310x150logo',
    content: '/favicons/_misc/mstile-310x150.png',
  },
  {
    tagName: 'meta',
    name: 'msapplication-square310x310logo',
    content: '/favicons/_misc/mstile-310x310.png',
  },
];

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Meta />
        <Links />
        <ThemeScript attribute="class" defaultTheme="system" enableSystem enableColorScheme />
      </head>
      <body>
        <a
          href="#main"
          className="bg-background text-foreground sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:rounded focus:px-3 focus:py-2 focus:shadow">
          Skip to content
        </a>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme>
      <Document>
        <Outlet />
      </Document>
    </ThemeProvider>
  );
}
