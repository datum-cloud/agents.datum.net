import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { reactRouterHonoServer } from 'react-router-hono-server/dev';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [tailwindcss(), reactRouterHonoServer({ runtime: 'bun' }), reactRouter()],
  optimizeDeps: {
    include: ['@datum-cloud/datum-ui/theme', '@datum-cloud/datum-ui/utils', 'lucide-react', 'zod'],
  },
  build: {
    target: 'esnext',
  },
});
