# Deploy agents.datum.net to Datum Compute

The site runs as a workload on the **general-purpose** runtime in the
`datum-cloud` project on Datum Compute. A release tag deploys it automatically.
The commands and the problems below come from the `datum.net` guide, which uses
the same runtime. We first tried the unikernel runtime and went back; see
[Unikernel attempt](#unikernel-attempt).

| Item          | Value                                                       |
| ------------- | ----------------------------------------------------------- |
| Project       | `datum-cloud`                                               |
| Workload      | `agents-datum-net-gp` (namespace `default`)                 |
| Runtime       | `general-purpose`, instance type `datumcloud/d1-standard-2` |
| Location      | `us-central-1`, 1 instance                                  |
| Image         | `ghcr.io/datum-cloud/agents-datum-net-compute:<tag>`        |
| Port          | `3000` (HTTP; the edge terminates TLS)                      |
| Env           | `HOST=::` (set by the deploy)                               |
| Public name   | `https://agents.datum.net` (custom hostname on the ALB)     |
| Generated URL | `https://joyful-vital-v4kpc.datumproxy.net`                 |

The GHCR package `agents-datum-net-compute` was created by hand (so a person owns
it) and is public. See [One-time setup](#one-time-setup).

**`agents.datum.net` is served from Compute.** See [Custom domain](#custom-domain).
The generated `*.datumproxy.net` URL keeps working and stays the same while the
workload exists. `destroy` changes it.

## How it fits together

```text
conventional commits on main
  -> release-please.yml keeps a release PR open
  -> merge the PR: release-please creates the tag vX.Y.Z and the GitHub release
  -> deploy-datum.yml (called by release-please.yml)
       builds Dockerfile and pushes
       ghcr.io/datum-cloud/agents-datum-net-compute:vX.Y.Z,
       deploys it to the workload, then checks the rollout and the URL
```

- The workflow builds the regular `Dockerfile`, the same one the Kubernetes image
  uses. `Dockerfile.datum` is the unikernel variant and is not used by CI.
- The Kubernetes publish jobs (`publish-container-image` and
  `publish-kustomize-bundles`) are **not part of CI any more**. They moved,
  unchanged, to `publish-kubernetes.yml`, which only runs by hand
  (Actions → Publish Kubernetes (manual)), so a rollback to Kubernetes stays
  possible. `ci.yml` now only runs lint, typecheck and build. The files in
  `config/` stay as they are. The manual workflow is untested since the move.
- The release deploy is called from `release-please.yml` because a release that
  `GITHUB_TOKEN` creates does not start workflows on `release: published`.

## Notes

- Instances have IPv6 addresses only, so the app must listen on `::`. The deploy
  sets `HOST=::`, and `app/server.ts` passes `HOST` to the Node server. With
  `HOST=0.0.0.0` the app starts and never answers.
- The app needs no Secret. Every variable has a default in `app/lib/env.ts`. To
  set a value, add `--env KEY=VALUE` to the deploy command.
- Datum does not replace an instance when the image tag is unchanged, so every
  deploy needs a new tag. Treat release tags as immutable.
- A workload keeps its runtime class. To change it, deploy under a new name and
  destroy the old one.

## One-time setup

1. **GitHub environment.** Create the environment `datum-compute` in the
   repository settings.
2. **Service account.** Create a Datum service account with edit access to the
   `datum-cloud` project, and save its credentials JSON as the environment secret
   `DATUM_SA_CREDENTIALS`. Do not commit the file.
3. **Pull requests from Actions.** In Settings → Actions → General, allow GitHub
   Actions to create and approve pull requests, so release-please can open the
   release PR.
4. **GHCR package.** The workload pulls the image anonymously, so the package
   `agents-datum-net-compute` must be **public**, and this repository needs the
   **Write** role under "Manage Actions access" so the job token can push. Set
   both in the package settings:
   https://github.com/orgs/datum-cloud/packages/container/agents-datum-net-compute/settings.
   GHCR creates a new package as private, and visibility cannot be changed
   through the API. The package was first pushed by hand, so a person owns it. A
   package that CI creates is managed only by repository or organization admins.
5. Optional: set the `DATUM_PROJECT` repository variable.

Compute is already enabled on `datum-cloud`
(`datumctl compute access --project datum-cloud`).

## Releasing

Merge the open **release PR** from release-please. It bumps `package.json`,
updates `CHANGELOG.md` and creates the tag. The deploy starts by itself.

Use conventional commit types. While the version is below 1.0, `feat` and `fix`
both bump the patch (`bump-patch-for-minor-pre-major`), and `!` or a
`BREAKING CHANGE` footer bumps the minor. `docs`, `chore`, `test`, `build` and
`ci` commits do not appear in the changelog. `CHANGELOG.md` is generated, so
Prettier ignores it.

Release PRs are opened with `GITHUB_TOKEN`, so the CI checks do not run on them.
That is fine for a content site. If you need required checks on release PRs, give
release-please a PAT or a GitHub App token.

## Deploy by hand

Actions → Deploy Datum Compute → Run workflow. It builds the selected ref, tags
the image `sha-<short sha>` and deploys it. Inputs: `project` (default
`datum-cloud`) and `location` (default `us-central-1`).

To roll back, run the workflow on the tag of the last good release. Do not
re-tag: Datum does not replace an instance when the image tag is unchanged.

Without CI, push an image first (`docker buildx build --platform linux/amd64
--push -t ghcr.io/datum-cloud/agents-datum-net-compute:<tag> .`), then run this
from a folder outside the repo, because `datumctl` writes `workload.yaml` into
the current folder and it must not be committed:

```bash
datumctl compute deploy agents-datum-net-gp \
  --project datum-cloud \
  --image ghcr.io/datum-cloud/agents-datum-net-compute:<tag> \
  --location us-central-1 \
  --http-port 3000 \
  --instance-type datumcloud/d1-standard-2 \
  --runtime-class general-purpose \
  --env "HOST=::" \
  --yes
```

## Check the workload

```bash
datumctl get workload agents-datum-net-gp -n default --project datum-cloud
datumctl get httpproxy agents-datum-net-gp -n default --project datum-cloud
datumctl compute logs agents-datum-net-gp --project datum-cloud
```

The workflow ends with a request to the URL the deploy printed and expects
`200`. `datumctl` prints the custom hostname when the workload has one (so
`https://agents.datum.net` here) and the generated `*.datumproxy.net` URL
otherwise; `bin/deploy-url` extracts whichever it printed. If your local
resolver does not know a new `*.datumproxy.net` name yet, look it up with
`dig +short AAAA <host> @1.1.1.1` and pin it with `curl --resolve`.

## Custom domain

`agents.datum.net` is a custom hostname on the workload's ALB (`HTTPProxy`
`agents-datum-net-gp`, `spec.hostnames`). The DNS record is a manual `CNAME` in
the `datum.net` zone, which Datum DNS hosts in the `datum-cloud` project:

```text
agents.datum.net  CNAME  joyful-vital-v4kpc.datumproxy.net.
```

It is one of 23 entries in the DNSRecordSet `datum-net-xq088a-cname`, next to
`www`, `docs`, `api`, `auth` and others. Change one entry only, with a JSON patch
that tests the name first, and run it with `--dry-run=server` before the real
one. Never `apply` a whole file over that object. The zone is not under Git.

Before the move, `agents` was `CNAME agents.prod.env.datum.net.` (the Kubernetes
gateway, `34.48.170.137`). To go back to Kubernetes, set the entry's
`cname.content` to `agents.prod.env.datum.net.`. The TTL is 300 seconds, so it
takes about five minutes. Kubernetes was not touched, so it can take traffic
again at once.

```bash
datumctl get httpproxy agents-datum-net-gp -n default --project datum-cloud -o json \
  | jq '.status.hostnameStatuses[] | select(.hostname=="agents.datum.net")'
```

The platform expects exactly this record (`managedBy: User`) and reports it as
`Present` once it exists.

- A new custom hostname gets its certificate only after DNS points at the ALB. In
  between, HTTPS to the name is reset for a few minutes. Plan the DNS switch for a
  quiet moment.
- `datumctl compute deploy` keeps the custom hostname when it updates the
  workload. **`datumctl compute destroy` removes the ALB together with its custom
  hostnames**, so `agents.datum.net` would stop answering until the hostname is
  added again.
- `staging.env` and `prod.env` in the `datum.net` zone are delegated to Google
  Cloud DNS. Records under those names live there, not in Datum DNS.

## Quotas

The URL of a workload is an `HTTPProxy`, and the project has a separate quota for
it. `datumctl compute quota` does **not** show it. When the quota is full the
workload runs but gets no URL: deploy ends with
`You've reached your quota for this resource type`, or the HTTPProxy stays
`Programmed=False` with `has not been scheduled` and `internal error`.

```bash
datumctl get allowancebuckets -A --project datum-cloud | grep -E "NAME|httpproxies"
```

The columns are `LIMIT`, `ALLOCATED` and `AVAILABLE`. The limit was 20 and was
raised to 25. Delete unused proxies, or ask for a higher limit, before deploying
a new workload. After the quota is raised, a stuck proxy does not retry by
itself: delete it (`datumctl delete httpproxy <name> -n default --project
datum-cloud`) and run the deploy again.

## Unikernel attempt

`Dockerfile.datum` builds the same site as a unikernel image with
`datumctl compute build`. We tested it and **chose general-purpose** because the
unikernel workload was not reliable through the public URL.

- The image passed `datumctl compute build --analyze`, ran as a container
  locally (200 on `/`, `/llms.txt` and the `/.well-known/*` paths), and booted on
  Compute (`Started server: http://:::3000`, backend healthy, workload
  `Available`).
- Through the `*.datumproxy.net` URL it answered `503` after about 11 seconds on
  every request we tried, about three minutes after the proxy came up, while the
  same image on general-purpose answered `200`. We did not run a longer sample, so
  we do not know whether the `503` would have cleared.
- The unikernel runtime has no `envFrom`, and Datum docs list limits such as the
  in-memory root filesystem. `datum.net` also saw an unstable unikernel run
  (11 of 20 requests answered).

To try it again, deploy it under a new name with `--runtime-class unikernel`, and
build with a `docker-container` BuildKit, because the default Docker driver
cannot export an OCI image:

```bash
docker buildx create --name dc --driver docker-container --bootstrap
datumctl compute build --analyze \
  --buildkit-host docker-container://buildx_buildkit_dc0 \
  --push --output ghcr.io/datum-cloud/agents-datum-net-compute:<tag> .
```

## Known gaps

- The deploy workflow has run once on a real release (`v0.2.3`, after a rerun
  because the package access was missing the first time). A release that only
  updates the workload is the normal case from now on, and has not run yet.
- `VITE_*` values are baked in at build time with their defaults, which is what
  production uses.
- One instance, no autoscaling.

## Cleanup

```bash
datumctl compute destroy agents-datum-net-gp --project datum-cloud --yes
```

This removes the instances, the generated URL and the custom hostname, and frees
the HTTPProxy quota. Point `agents` back at Kubernetes first, or the name stops
answering.
