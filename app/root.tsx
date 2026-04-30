import './styles/globals.css';
import { ThemeProvider, ThemeScript } from '@datum-cloud/datum-ui/theme';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import type { LinksFunction, MetaFunction } from 'react-router';

export const links: LinksFunction = () => [
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
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
