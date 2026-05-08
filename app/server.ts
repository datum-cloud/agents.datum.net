import llmsContent from '../public/llms.txt?raw';
import { createHonoServer } from 'react-router-hono-server/bun';

const apiCatalog = {
  linkset: [
    {
      anchor: 'https://agents.datum.net/',
      'service-doc': [{ href: 'https://www.datum.net/docs', type: 'text/html' }],
      describedby: [{ href: 'https://agents.datum.net/llms.txt', type: 'text/plain' }],
    },
  ],
};

export default createHonoServer({
  configure(app) {
    // Serve /.well-known/api-catalog with RFC 9727 Content-Type
    app.get('/.well-known/api-catalog', (c) => {
      return c.body(JSON.stringify(apiCatalog), 200, {
        'Content-Type': 'application/linkset+json',
      });
    });

    // Markdown content negotiation — return llms.txt when agents request text/markdown
    app.get('/', async (c, next) => {
      const accept = c.req.header('Accept') ?? '';
      if (accept.includes('text/markdown')) {
        return c.body(llmsContent, 200, {
          'Content-Type': 'text/markdown; charset=utf-8',
          Vary: 'Accept',
        });
      }
      return next();
    });
  },
});
