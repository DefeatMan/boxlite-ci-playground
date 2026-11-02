import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const archive = 'playground.tar.gz';
const checksum = `${createHash('sha256').update(readFileSync(`dist/${archive}`)).digest('hex')}  ${archive}\n`;
if (process.argv[2] === 'verify') {
  if (readFileSync('dist/SHA256SUMS', 'utf8') !== checksum) throw new Error('Archive checksum mismatch');
  console.log('Archive checksum verified');
} else {
  writeFileSync('dist/SHA256SUMS', checksum);
}
