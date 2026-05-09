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

// OIDC Discovery (OpenID Connect Core §4) — points agents to Datum's auth server
const oidcConfig = {
  issuer: 'https://auth.datum.net',
  authorization_endpoint: 'https://auth.datum.net/oauth/v2/authorize',
  token_endpoint: 'https://auth.datum.net/oauth/v2/token',
  device_authorization_endpoint: 'https://auth.datum.net/oauth/v2/device_authorization',
  jwks_uri: 'https://auth.datum.net/oauth/v2/keys',
  userinfo_endpoint: 'https://auth.datum.net/oidc/v1/userinfo',
  grant_types_supported: [
    'authorization_code',
    'refresh_token',
    'urn:ietf:params:oauth:grant-type:device_code',
    'client_credentials',
  ],
  response_types_supported: ['code'],
  code_challenge_methods_supported: ['S256'],
  subject_types_supported: ['public'],
  id_token_signing_alg_values_supported: ['RS256'],
  scopes_supported: ['openid', 'profile', 'email', 'offline_access'],
};

// OAuth Protected Resource Metadata (RFC 9728)
const oauthProtectedResource = {
  resource: 'https://agents.datum.net/',
  authorization_servers: ['https://auth.datum.net'],
  bearer_methods_supported: ['header'],
  scopes_supported: ['openid', 'profile', 'email', 'offline_access'],
  resource_documentation: 'https://www.datum.net/docs/platform/machine-accounts',
};

export default createHonoServer({
  configure(app) {
    // Serve /.well-known/api-catalog with RFC 9727 Content-Type
    app.get('/.well-known/api-catalog', (c) => {
      return c.body(JSON.stringify(apiCatalog), 200, {
        'Content-Type': 'application/linkset+json',
      });
    });

    // OIDC Discovery — OpenID Connect Discovery 1.0
    app.get('/.well-known/openid-configuration', (c) => {
      return c.json(oidcConfig);
    });

    // OAuth Protected Resource Metadata — RFC 9728
    app.get('/.well-known/oauth-protected-resource', (c) => {
      return c.json(oauthProtectedResource);
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
