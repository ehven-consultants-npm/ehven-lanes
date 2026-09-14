import { readFile } from 'node:fs/promises';

const projectRoot = new URL('../', import.meta.url);
const packageFile = new URL('package.json', projectRoot);
const suppliedTag = process.argv[2];

if (!suppliedTag) {
  console.error(
    'Usage: node scripts/verify-version.mjs <git-tag>',
  );
  process.exit(1);
}

const packageMetadata = JSON.parse(
  await readFile(packageFile, 'utf8'),
);

const expectedTag = `v${packageMetadata.version}`;

if (suppliedTag !== expectedTag) {
  console.error(
    `Release tag mismatch: expected ${expectedTag}, ` +
    `received ${suppliedTag}.`,
  );
  process.exit(1);
}

console.log(
  `Release tag ${suppliedTag} matches ` +
  `${packageMetadata.name} v${packageMetadata.version}.`,
);
