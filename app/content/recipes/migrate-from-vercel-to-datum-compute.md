# Recipe: Migrate a Node SSR app from Vercel to Datum Compute

Move a Node server-side-rendered app from Vercel to a Datum Compute workload on
the `general-purpose` runtime.

Based on the `datum.net` Compute walkthrough (`docs/datum-compute-walkthrough.md`).
Steps marked **(verified)** were tested there. Steps marked **(untested)** are
Vercel-specific advice that the walkthrough does not cover.

**Audience:** engineers who run an app on Vercel today.
**Result:** your app runs as a container on Datum Compute, with secrets, a public
URL, a rollback path and CI deploys.

## 1. How Vercel concepts map to Datum Compute

| Vercel                                                                                                  | Datum Compute                                                                                                                               |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Project                                                                                                 | Datum project, plus one **workload** per app and environment                                                                                |
| Build on push (Vercel builds)                                                                           | You build and push a container image (for example in GitHub Actions)                                                                        |
| Deployment                                                                                              | A workload rollout to a new image tag                                                                                                       |
| Environment variables                                                                                   | A Kubernetes-style **Secret**, imported with `--env-from-secret`                                                                            |
| `vercel.app` URL                                                                                        | `*.datumproxy.net` URL, printed by `deploy`                                                                                                 |
| Custom domain                                                                                           | `hostnames` on the workload's HTTPProxy (this changes DNS)                                                                                  |
| Instant rollback                                                                                        | Deploy an older image tag                                                                                                                   |
| Preview deployments per branch                                                                          | Not available yet (a design exists in `datum-compute-previews.md`)                                                                          |
| Password protection                                                                                     | Basic authentication on the whole load balancer, set in the console                                                                         |
| Serverless / Edge Functions, ISR, Cron, Image Optimization, BotID, Runtime Cache, `vercel.json` headers | No platform equivalent. See "Vercel-specific features: what to replace" for what to do with each. ISR and Edge Functions are **(untested)** |

## 2. Before you start

- `datumctl` with the `compute` plugin, logged in: `datumctl auth list`.
- A Datum project with Compute enabled (step 4).
- An app that runs as a long-lived Node server. Next.js apps need a server
  build (for example `output: "standalone"`), not a Vercel-only build output **(untested)**.
- Somewhere to push images. The walkthrough used a **public** GHCR package, so
  no registry login was needed. Private registries are **(untested)**.

## 3. Containerize the app **(untested for your app; the pattern is verified)**

Vercel builds for you. On Compute you provide the image. A minimal example for
a Node server, adjust to your framework:

```dockerfile
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4321
ENV HOST="::"
# Copy only what the server needs at runtime: the build output, the pruned
# node_modules and package.json. Adjust the paths to your framework.
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./
USER node
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
```

The `CMD` is the server entry your framework's Node build produces (here, the
standalone output of Astro's Node adapter). Use your own. If `npm ci` runs
git-hook installers such as `husky` as a `postinstall`, disable them in the
build stage (for example `ENV HUSKY=0`).

Two rules matter:

1. **Listen on `HOST=::`, not `0.0.0.0`.** Datum networks are IPv6-only. An
   app bound to IPv4 starts but never answers. Make your server read `HOST` at
   runtime, set `ENV HOST="::"` in the Dockerfile, and also pass
   `--env="HOST=::"` at deploy time. **(verified)**
2. **Pick one port** and pass it as `--http-port`. The edge terminates TLS, so
   the app serves plain HTTP.

Exclude `.env*` from the image with a `.dockerignore`. Secrets must only arrive
at runtime from the Secret.

Build and push, tagging every build with a unique, immutable tag. On Apple
Silicon, build for `linux/amd64` explicitly. This was done as a precaution;
whether Datum rejects an arm64 image was **not tested**:

```bash
docker buildx build --platform linux/amd64 \
  -t ghcr.io/<org>/<app>:v1.0.0 --push .
```

Do not reuse a tag. Datum does not replace an instance when the image tag is
unchanged, so a moved tag silently does nothing. **(verified)**

### Registry notes (GHCR) **(verified)**

- A new GHCR package is **private**. Datum pulls without credentials, so make it
  public. Visibility can only be changed in the GitHub UI (package settings →
  Danger Zone → Change visibility). `gh` and the REST API cannot do it.
- A workflow's built-in `GITHUB_TOKEN` can only push packages under the
  **repo's own org**. To push to a different org you need a personal access
  token stored as a secret.
- Check that the image really pulls anonymously before you deploy:

  ```bash
  T=$(curl -s "https://ghcr.io/token?scope=repository:<org>/<app>:pull" \
    | python3 -I -c 'import sys,json;print(json.load(sys.stdin)["token"])')
  curl -s -o /dev/null -w "%{http_code}\n" -H "Authorization: Bearer $T" \
    -H "Accept: application/vnd.oci.image.index.v1+json" \
    https://ghcr.io/v2/<org>/<app>/manifests/v1.0.0     # expect 200
  ```

## 4. Enable Compute

A new project has Compute off. **(verified)**

```bash
datumctl compute access --project <project>        # Status: Not requested
datumctl services enable compute.datumapis.com --project <project>
```

Compute turns on at once, but the project's **locations** show up a few
minutes later. Until then a deploy fails with `Unsupported value: "us-central-1"`.
Wait until this lists locations:

```bash
datumctl get locations --project <project>
```

**Listed is not the same as deployable.** `get locations` can list locations
(for example `de-central-1` or `jp-east-1`) that a workload does not accept yet.
At the time of writing a workload only accepted `us-central-1`, `us-east-1` and
`us-west-1`. A deploy to an unsupported location fails with
`Unsupported value: "<location>": supported values: ...`, and that message is
the reliable list, so use it. Pick the supported location closest to your
users. **(verified)**

## 5. Move your environment variables into a Secret

1. Export the variables from Vercel: `vercel env pull .env.production --environment=production`
   (or copy them from the dashboard). Keep this file **outside** the repo and
   never paste it in chat.

   **Vercel never exports sensitive variables.** For variables of type
   _Sensitive_, `vercel env pull` writes the literal text `[SENSITIVE]` (not an
   empty value, not an error). It is printable text, so it passes the strict
   check below, so it ends up in the Secret as a real-looking value. A
   placeholder in an auth secret such as a cron or webhook secret is a known,
   guessable string. Get those values from the original provider (or a local
   `.env.local`), or generate a new one where only your own app has to match
   it (then set the same value wherever the caller needs it). Never leave the
   placeholder in place. `vercel env ls` shows which variables are Sensitive.
   **(verified)**

2. Drop Vercel-only variables such as `VERCEL`, `VERCEL_URL` and `VERCEL_ENV`.
   If your code reads them, replace them with your own variables. **(untested)**
3. Create a Secret in the `default` namespace of the project, for example
   `<app>-secrets`, with one key per variable.

### Create the Secret from the CLI, not the console form

The console form can store values as raw bytes instead of text. In the
walkthrough, six keys then held control characters, the instance failed with
`ConfigurationError`, and the message only said "configuration error".
**(verified)**

Read values from your local file and write the Secret with `datumctl apply`:

```bash
datumctl get secret <app>-secrets -n default --project <project> -o json \
  | python3 -I -c '<set data[KEY] = base64(value) from your env file>' \
  > secret.json
datumctl apply -f secret.json --project <project> --dry-run=server
datumctl apply -f secret.json --project <project>
rm secret.json
```

The warning about a missing `last-applied-configuration` annotation is harmless.

For a Secret that does not exist yet, apply a manifest you build locally
(`apiVersion: v1`, `kind: Secret`, `type: Opaque`, `data` with base64 values).
To change single keys later, use a merge patch, then roll the workload
(section 11): **(verified)**

```bash
datumctl patch secret <app>-secrets -n default --project <project> \
  --type merge --patch-file patch.json     # {"data": {"KEY": "<base64>"}}
rm patch.json
```

Keep manifests and patch files outside the repo and delete them straight away.
Print key names and lengths when you check them, never values.

### Validate the Secret strictly

Run this after every change. Do not decode with `errors="ignore"`, because it
hides corrupt bytes.

```bash
datumctl get secret <app>-secrets -n default --project <project> -o json \
  | python3 -I -c '
import sys, json, base64
bad = []
for k, v in json.load(sys.stdin)["data"].items():
    b = base64.b64decode(v)
    # PEM keys contain newlines; every other value must be single-line text.
    if not b.isascii() or not all(c.isprintable() or c == "\n" for c in b.decode()):
        bad.append(k)
print("invalid keys:", bad or "none")'
```

Also check for Vercel placeholders. This prints key names only, never values:

```bash
datumctl get secret <app>-secrets -n default --project <project> -o json \
  | python3 -I -c '
import sys, json, base64
bad = [k for k, v in json.load(sys.stdin)["data"].items()
       if "SENSITIVE" in base64.b64decode(v).decode().upper()]
print("placeholder keys:", bad or "none")'
```

## 6. Deploy

Run this from a folder **outside** your repo. The command writes
`workload.yaml` into the current folder, and it must not be committed.
**(verified)**

```bash
datumctl compute deploy <app>-gp \
  --project <project> \
  --image=ghcr.io/<org>/<app>:v1.0.0 \
  --location=us-central-1 \
  --http-port=4321 \
  --instance-type=datumcloud/d1-standard-2 \
  --runtime-class=general-purpose \
  --env="HOST=::" \
  --env-from-secret=<app>-secrets \
  --yes
```

- If it says `Network "default" does not exist`, the deploy creates it.
- The last line prints the public URL.
- Use `general-purpose` for a normal container image. The unikernel runtime
  needs `datumctl compute build` instead of `docker build`, and it was unstable
  for one service in the walkthrough's tests.
- A workload keeps its runtime class. To change it, deploy under a new name and
  destroy the old one.

## 7. Verify before you switch traffic

```bash
datumctl get workload <app>-gp -n default --project <project>    # AVAILABLE True
datumctl compute instances --project <project>                    # list instances
```

`datumctl compute logs` does **not** exist in compute plugin v0.11. Available
subcommands: `access`, `build`, `deploy`, `destroy`, `exec`, `instances`,
`quota`, `restart`, `rollout`, `scale`, `workloads`. A way to read application
logs was not found, so add a diagnostic route or log to an external service if
you need to see what the app receives. **(verified)**

While a rollout is in progress the edge returns an HTML error page ("Datum AI
Edge") instead of your app. Poll `/api/health` until it returns `200` before
you judge the result.

Then request the site. A new hostname may not resolve on your machine yet
(`Could not resolve host`). Look it up through 1.1.1.1 and pin it:

```bash
H=<hostname>.datumproxy.net
IP=$(dig +short A $H @1.1.1.1 | head -1)
curl -s -o /dev/null -w "%{http_code}\n" --resolve "$H:443:$IP" https://$H/
```

Compare it with Vercel page by page: key routes, data from your CMS or API,
forms, auth, and anything that calls a third party. The walkthrough did **not**
test login-protected pages, reCAPTCHA, or email forms, so test them yourself.

## 8. Cut over the custom domain

1. Check what the name points to today. Attaching a hostname creates a managed
   `ALIAS` record in your zone **and takes over that name.** **(verified)**
2. Attach the hostname:

   ```bash
   datumctl patch httpproxy <app>-gp -n default --project <project> \
     --type merge -p '{"spec":{"hostnames":["www.example.com"]}}'
   ```

3. Keep the Vercel project until you are sure. Rolling back DNS is your
   fallback. **(untested: DNS TTL and apex-domain behavior)**
4. If your app builds absolute URLs, sitemaps or canonical links at build time,
   build the image with the final domain. The walkthrough image did not, so its
   canonical URL did not match the Compute hostname.
5. **Keep search indexing off on the `*.datumproxy.net` URL**, or the staging
   copy gets indexed as a duplicate of your real site. If your app has an
   "allow indexing" flag, set it to false in the Secret and flip it (and roll
   the workload) at cutover. A flag that is a typed boolean needs an explicit
   `false`, not a blank value.
6. **Do not swap the framework adapter on a branch that Vercel deploys.**
   Vercel builds from your Git branch. If the migration changes the adapter
   (for example `@astrojs/vercel` to `@astrojs/node`), merging it to the branch
   Vercel watches breaks Vercel, and with it your rollback path. Keep the
   migration on a separate branch until DNS has moved and you are sure.

## 9. Deploy from GitHub Actions (replaces Vercel's Git integration)

Vercel deploys on every push. On Compute, build and push the image, then roll
the workload with `datumctl compute deploy`. The `datum.net` workflow does this:

- Push to `main` deploys **staging** with tag `v0.0.0-<short sha>`.
- A published release deploys **production** with the release tag.
- It installs `datumctl` and the `compute` plugin, logs in as a **service
  account**, checks the Secret strictly, deploys with `HOST=::`, and confirms
  the workload reports the intended image.
- It never runs `destroy`, so the URL and basic auth stay.

One-time setup:

1. Create GitHub environments, for example `datum-compute` and
   `datum-compute-staging`.
2. Create a Datum service account with edit access to the project. Save its
   credentials JSON as the environment secret `DATUM_SA_CREDENTIALS`. Do not
   commit the file.
3. Create the Secret for each target and make sure it passes the strict check.

Use `DEPLOY_REV=<run id>` (a "force rollout" option) after you change a Secret,
because instances read the Secret only at start.

Notes on the CI setup:

- The service account logs in with `datumctl login --credentials ./key.json`
  (no browser, no prompts). Delete the key file right after login.
- A `workflow_dispatch` workflow only appears and can only be dispatched once
  the workflow file exists on the repo's **default branch**. You cannot test it
  from a feature branch alone. For the first image, build and push locally
  (section 3) and deploy by hand.
- A scheduled job replaces Vercel Cron. Datum Compute has no scheduler, so use
  a GitHub Actions `schedule` that calls the protected endpoint with a bearer
  secret. **(untested end to end)**
- **Untested:** installing `datumctl` and the compute plugin on a CI runner
  (for example `brew install datum-cloud/tap/datumctl` then
  `datumctl plugin install compute`), and a full run as a service account.

## 10. Roll back

Redeploy the last good tag. The image is already in the registry, so nothing is
rebuilt:

```bash
datumctl compute deploy <app>-gp --project <project> \
  --image=ghcr.io/<org>/<app>:v0.9.0 --location=us-central-1 --yes
```

- When you pass `--image`, also pass `--location`.
- Do not re-tag or cherry-pick to roll back. Treat tags as immutable.
- To fix the bug for good, `git revert` the change and publish a new, higher
  version.

## 11. Rolling after a Secret change

Instances read the Secret only at start. A redeploy with the same image and
settings does nothing, so change something in the template, such as a marker
variable you raise each time:

```bash
datumctl compute deploy <app>-gp --project <project> \
  --image=ghcr.io/<org>/<app>:v1.0.0 \
  --location=us-central-1 --env="SECRETS_REV=2" --yes
```

A failed instance blocks the rollout, because placement is `OrderedReady`. If
the old instance is stuck in `ConfigurationError`, the rollout stays `Pending`
and you cannot delete the instance (`Forbidden`). Fix the Secret, then
`datumctl compute destroy <app>-gp --yes` and deploy again. That changes the
URL and removes basic auth.

## Basic authentication (replaces Vercel password protection)

The console dialog **Edit Basic Authentication** protects the whole load
balancer. Be aware:

- There are no path exceptions. `/livez` and `/readyz` also return `401` from the
  public URL. The backend stays healthy, because the platform checks health
  internally.
- Webhooks that call the URL get `401`. Do not point a webhook at it while auth
  is on.
- `destroy` removes the URL, so you set up basic auth again after a redeploy
  under a new URL. Roll in place instead.

## Troubleshooting

| Symptom                                               | Cause                                                   | Fix                                                     |
| ----------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- |
| `Unsupported value: "us-central-1"` on deploy         | The project's locations are not provisioned yet         | Wait; `datumctl get locations` must list them           |
| `ConfigurationError` on the instance                  | A Secret value is not valid text                        | Run the strict check, fix the key, destroy and redeploy |
| Rollout stays `Pending` after a fix                   | `OrderedReady` waits for the failed instance            | Destroy and redeploy                                    |
| `Forbidden` when deleting an instance                 | Users cannot delete instances                           | Destroy the workload instead                            |
| App starts, never answers                             | Server bound to `0.0.0.0` instead of `::`               | Redeploy with `--env="HOST=::"`                         |
| `Could not resolve host` for a new `*.datumproxy.net` | Local resolver cache                                    | Resolve through 1.1.1.1 and use `--resolve`             |
| `401` on every URL                                    | Basic authentication is on                              | Send credentials, or turn it off in the console         |
| Secret change has no effect                           | Instances read the Secret only at start                 | Roll the workload (section 11)                          |
| Redeploy of the same tag does nothing                 | Datum does not replace an instance for an unchanged tag | Use a new tag                                           |
| `Unsupported value: "de-central-1": supported values` | `get locations` lists more than workloads accept        | Use one of the supported values in the error            |
| Secret has `[SENSITIVE]` values                       | `vercel env pull` cannot export sensitive variables     | Get real values elsewhere; run the placeholder check    |
| Image will not pull                                   | GHCR package is private                                 | Make it public in the GitHub UI                         |
| HTML "Datum AI Edge" error page right after deploy    | Rollout still in progress                               | Poll `/api/health` until `200`                          |
| Pages return 404 after adding response headers        | A header value has a non-ASCII character                | Keep header values ASCII                                |

## Vercel-specific features: what to replace

Check each of these that your app uses. Examples use Astro and Node; the
pattern applies to other frameworks. **(verified)** unless noted.

| Feature on Vercel                   | What to do on Datum Compute                                                                                                                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Framework adapter or build output   | Switch to a Node server build. For example, replace Astro's Vercel adapter with `@astrojs/node` in `standalone` mode (it also serves the built static files). Check the adapter's minimum framework version. |
| `vercel.json` headers, CSP          | They stop applying. Move them into app middleware. Static files (served before middleware) do **not** get them, so only HTML and API responses are covered.                                                  |
| `vercel.json` rewrites              | Gone. The BotID proxy rewrites are not needed once BotID is removed.                                                                                                                                         |
| Header values                       | Must be ASCII (Latin-1). One non-Latin-1 character (an em dash in a `Link` header) made `Headers.set()` throw and turned two pages into 404s.                                                                |
| Vercel Cron                         | Replace with a GitHub Actions schedule calling the endpoint (see section 9).                                                                                                                                 |
| BotID                               | Works only behind Vercel's edge. It cannot work from a container. Replace it, for example with a honeypot, a minimum-fill-time check and a per-IP rate limit.                                                |
| Runtime Cache (`@vercel/functions`) | Replace with another cache driver. An in-memory driver is fine for **one replica only**: invalidation reaches just the instance that receives it. Use a shared store before scaling out.                     |
| Image Optimization                  | The Astro `sharp` image service works in the container.                                                                                                                                                      |
| `VERCEL_*` variables                | Drop them and read your own variables or the request hostname.                                                                                                                                               |

**Client IP for rate limiting.** The Datum edge appends the real client IP as the
**rightmost** `X-Forwarded-For` entry; leftmost entries are client-controlled.
`clientAddress` in the framework is an internal `fd42:` address, so do not use
it. Verified by sending spoofed `X-Forwarded-For` values, which did not bypass
the limit. Note that a client with several egress IPs is counted per IP.

## Known gaps to plan for

- No automatic preview URL per branch.
- No Redis in the walkthrough: one replica, local cache fallback.
- Vercel-managed features (Edge/Serverless Functions, ISR and its cache,
  Cron Jobs, Image Optimization, Analytics, Web Vitals) have no direct
  equivalent in the walkthrough. Check each one your app uses. See
  "Vercel-specific features: what to replace" for the ones that came up in a
  real migration. ISR, Analytics and Web Vitals were **not** covered.
- Workload locations are limited to the `us-*` values for now, so users in
  Europe or Asia get higher latency.
- A rollout after a Secret change (section 11) and DNS cutover have **not**
  been exercised end to end.
- Use scoped tokens in the Secret, not personal ones, before real use.
- The full CI workflow was confirmed with a previous project and service
  account. A run with the current one was still to be confirmed.

## Cleanup

```bash
datumctl compute destroy <app>-gp --project <project> --yes   # instances and URL; the Secret stays
rm workload.yaml                                                # generated file, never commit it
```
