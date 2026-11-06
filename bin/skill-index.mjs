#!/usr/bin/env node
// Build and check public/.well-known/agent-skills/index.json from the Datum
// Claude Code plugin marketplace.
//
//   bin/skill-index.mjs generate   rewrite the index from the marketplace
//   bin/skill-index.mjs check      every entry is well-formed, its URL returns
//                                  200, and the bytes match its digest
//   bin/skill-index.mjs drift      the committed index matches what generate
//                                  would write today
//
// Every URL is pinned to a commit, so a skill moving or changing upstream never
// breaks the committed index; it only makes it stale, which drift reports.
// Set GITHUB_TOKEN to raise the GitHub API rate limit.
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MARKETPLACE_REPO = 'datum-cloud/claude-code-plugins';
const MARKETPLACE_PATH = '.claude-plugin/marketplace.json';
const SCHEMA = 'https://schemas.agentskills.io/discovery/0.2.0/schema.json';
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DIGEST_RE = /^sha256:[0-9a-f]{64}$/;
const INDEX_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'public/.well-known/agent-skills/index.json'
);

async function github(path) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'skill-index' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com/${path}`, { headers });
  if (!res.ok) throw new Error(`GET api.github.com/${path}: ${res.status}`);
  return res.json();
}

async function raw(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

const rawUrl = (repo, sha, path) => `https://raw.githubusercontent.com/${repo}/${sha}/${path}`;
const digestOf = (bytes) => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
const trimSlashes = (p) => (p ?? '').replace(/^\.?\/+|\/+$/g, '').replace(/^\.$/, '');

function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const fields = {};
  const lines = m[1].split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    const block = value.match(/^([>|])[-+]?$/);
    if (block) {
      const body = [];
      while (i + 1 < lines.length && /^(\s|$)/.test(lines[i + 1])) body.push(lines[++i].trim());
      value =
        block[1] === '|'
          ? body.join('\n').trim()
          : body
              .join('\n')
              .trim()
              .split(/\n{2,}/)
              .map((p) => p.replace(/\n/g, ' '))
              .join('\n');
    } else if (/^".*"$/.test(value)) value = JSON.parse(value);
    else if (/^'.*'$/.test(value)) value = value.slice(1, -1).replace(/''/g, "'");
    fields[kv[1]] = value;
  }
  return fields;
}

function pluginSource(plugin) {
  const s = plugin.source;
  if (typeof s === 'string') return { repo: MARKETPLACE_REPO, root: trimSlashes(s) };
  if (s?.source === 'github') return { repo: s.repo, root: '', ref: s.sha ?? s.ref };
  if (s?.source === 'git-subdir') {
    const repo = s.url.match(/github\.com\/([^/]+\/[^/.]+)(\.git)?$/)?.[1];
    if (!repo) throw new Error(`${plugin.name}: unsupported git-subdir url ${s.url}`);
    return { repo, root: trimSlashes(s.path), ref: s.sha ?? s.ref };
  }
  throw new Error(`${plugin.name}: unsupported source ${JSON.stringify(s)}`);
}

async function skillDirs(repo, sha, root) {
  const manifest = await raw(rawUrl(repo, sha, join(root, '.claude-plugin/plugin.json'))).then(
    (b) => JSON.parse(b.toString('utf8')),
    () => ({})
  );
  const declared = [manifest.skills ?? []].flat().map(trimSlashes);
  return ['skills', ...declared].map((d) => (root ? join(root, d) : d));
}

async function generate() {
  const { sha: mpSha } = await github(`repos/${MARKETPLACE_REPO}/commits/HEAD`);
  const marketplace = JSON.parse(
    (await raw(rawUrl(MARKETPLACE_REPO, mpSha, MARKETPLACE_PATH))).toString('utf8')
  );

  const entries = [];
  for (const plugin of marketplace.plugins) {
    const { repo, root, ref } = pluginSource(plugin);
    const { sha } = await github(`repos/${repo}/commits/${ref ?? 'HEAD'}`);
    const dirs = await skillDirs(repo, sha, root);
    const { tree, truncated } = await github(`repos/${repo}/git/trees/${sha}?recursive=1`);
    if (truncated) throw new Error(`${repo}: git tree truncated`);
    const paths = tree
      .filter((t) => t.type === 'blob')
      .map((t) => t.path)
      .filter((p) => dirs.some((d) => new RegExp(`^${d}/[^/]+/SKILL\\.md$`).test(p)))
      .sort();
    if (paths.length === 0) throw new Error(`${plugin.name}: no skills under ${dirs.join(', ')}`);

    for (const path of paths) {
      const url = rawUrl(repo, sha, path);
      const bytes = await raw(url);
      const fm = frontmatter(bytes.toString('utf8'));
      const name = fm.name || path.split('/').at(-2);
      if (!fm.description) throw new Error(`${url}: no description in frontmatter`);
      entries.push({
        name,
        type: 'skill-md',
        description: fm.description,
        url,
        digest: digestOf(bytes),
        plugin: plugin.name,
      });
    }
  }

  const counts = new Map();
  for (const e of entries) counts.set(e.name, (counts.get(e.name) ?? 0) + 1);
  for (const e of entries) if (counts.get(e.name) > 1) e.name = `${e.plugin}-${e.name}`;

  return {
    $schema: SCHEMA,
    name: 'Datum Cloud Agent Skills',
    description: marketplace.description,
    marketplace: `https://github.com/${MARKETPLACE_REPO}`,
    installation: {
      'claude-code': `/plugin marketplace add ${MARKETPLACE_REPO}`,
    },
    skills: entries,
  };
}

const serialize = (index) => `${JSON.stringify(index, null, 2)}\n`;

async function check(index) {
  const errors = [];
  if (index.$schema !== SCHEMA) errors.push(`$schema is ${index.$schema}, want ${SCHEMA}`);
  if (!Array.isArray(index.skills) || index.skills.length === 0) errors.push('no skills');
  const seen = new Set();
  for (const s of index.skills ?? []) {
    const id = s.name ?? JSON.stringify(s);
    if (!NAME_RE.test(s.name ?? '') || s.name.length > 64) errors.push(`${id}: invalid name`);
    if (seen.has(s.name)) errors.push(`${id}: duplicate name`);
    seen.add(s.name);
    if (s.type !== 'skill-md') errors.push(`${id}: type ${s.type}, want skill-md`);
    if (!s.description || s.description.length > 1024) errors.push(`${id}: bad description`);
    if (!DIGEST_RE.test(s.digest ?? '')) errors.push(`${id}: bad digest`);
  }
  const results = await Promise.all(
    (index.skills ?? []).map(async (s) => {
      const res = await fetch(s.url).catch((e) => ({ status: e.message }));
      if (res.status !== 200) return `${s.name}: ${s.url} returned ${res.status}`;
      const got = digestOf(Buffer.from(await res.arrayBuffer()));
      return got === s.digest ? null : `${s.name}: digest ${got}, index says ${s.digest}`;
    })
  );
  errors.push(...results.filter(Boolean));
  return errors;
}

const mode = process.argv[2];
if (mode === 'generate') {
  const index = await generate();
  await writeFile(INDEX_PATH, serialize(index));
  console.log(`wrote ${index.skills.length} skills to ${INDEX_PATH}`);
} else if (mode === 'check') {
  const index = JSON.parse(await readFile(INDEX_PATH, 'utf8'));
  const errors = await check(index);
  for (const e of errors) console.error(e);
  if (errors.length) process.exit(1);
  console.log(`${index.skills.length} skills: every URL returned 200 and matched its digest`);
} else if (mode === 'drift') {
  const want = serialize(await generate());
  const have = await readFile(INDEX_PATH, 'utf8');
  if (want !== have) {
    console.error(
      `${INDEX_PATH} is out of date with ${MARKETPLACE_REPO}; run bin/skill-index.mjs generate`
    );
    process.exit(1);
  }
  console.log('skill index matches the marketplace');
} else {
  console.error('usage: bin/skill-index.mjs generate|check|drift');
  process.exit(2);
}
