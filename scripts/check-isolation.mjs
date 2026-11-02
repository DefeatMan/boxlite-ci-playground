import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

assert.equal(process.platform, 'linux');
assert.match(process.env.RUNNER_NAME ?? '', /^ci-/);
for (const name of ['BOXLITE_API_KEY', 'GITHUB_APP_PRIVATE_KEY_FILE', 'GITHUB_APP_ID', 'CI_STATE_DIR']) {
  assert.equal(process.env[name], undefined, `${name} must not enter a worker`);
}
for (const file of ['private-key.pem', 'ci-state', '.boxlite-jitconfig', '.boxlite-jitconfig.ready']) {
  assert.equal(existsSync(`/home/runner/${file}`), false, `Unexpected management file: ${file}`);
}
console.log('Worker isolation checks passed');
