import { readFileSync } from 'node:fs';

const repository = process.env.GITHUB_REPOSITORY;
const tag = process.env.RELEASE_TAG;
const token = process.env.GH_TOKEN;
const version = JSON.parse(readFileSync('package.json', 'utf8')).version;
if (!/^[\w.-]+\/[\w.-]+$/.test(repository ?? '') || tag !== `v${version}` || !token) {
  throw new Error('Repository, release tag or workflow token is invalid');
}
async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, ...options.headers },
    redirect: 'error',
    signal: AbortSignal.timeout(60000),
  });
  if (!response.ok) throw new Error(`GitHub release request failed: HTTP ${response.status}`);
  return response.json();
}
const release = await request(`https://api.github.com/repos/${repository}/releases/tags/${encodeURIComponent(tag)}`);
if (release.draft || release.tag_name !== tag || !Number.isSafeInteger(release.id)) throw new Error('Unexpected release');
for (const name of ['playground.tar.gz', 'SHA256SUMS']) {
  const result = await request(`https://uploads.github.com/repos/${repository}/releases/${release.id}/assets?name=${name}`, {
    method: 'POST', headers: { 'Content-Type': 'application/octet-stream' }, body: readFileSync(`dist/${name}`),
  });
  console.log(`Published ${result.name} (${result.size} bytes)`);
}
