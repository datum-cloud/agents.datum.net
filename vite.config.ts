import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { reactRouterHonoServer } from 'react-router-hono-server/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tailwindcss(),
    reactRouterHonoServer({ runtime: 'bun' }),
    reactRouter(),
    tsconfigPaths(),
  ],
  build: {
    target: 'esnext',
  },
});
