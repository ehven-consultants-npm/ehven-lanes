import {
  mkdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';

import { transform } from 'lightningcss';

const projectRoot = new URL('../', import.meta.url);
const packageFile = new URL('package.json', projectRoot);
const sourceFile = new URL('src/lanes.css', projectRoot);
const distributionDirectory = new URL('dist/', projectRoot);
const readableFile = new URL('dist/lanes.css', projectRoot);
const minifiedFile = new URL('dist/lanes.min.css', projectRoot);

const packageMetadata = JSON.parse(
  await readFile(packageFile, 'utf8'),
);

const sourceContents = await readFile(sourceFile, 'utf8');
const sourceCss = sourceContents.endsWith('\n')
  ? sourceContents
  : `${sourceContents}\n`;

const banner =
  `/*! ${packageMetadata.name} v${packageMetadata.version} | ` +
  `MIT License | ${packageMetadata.homepage} */\n`;

const transformed = transform({
  filename: 'lanes.css',
  code: Buffer.from(sourceCss),
  minify: true,
});

const minifiedCss = transformed.code.toString().trim();

await rm(distributionDirectory, {
  recursive: true,
  force: true,
});

await mkdir(distributionDirectory, {
  recursive: true,
});

await Promise.all([
  writeFile(
    readableFile,
    `${banner}${sourceCss}`,
    'utf8',
  ),
  writeFile(
    minifiedFile,
    `${banner}${minifiedCss}\n`,
    'utf8',
  ),
]);

console.log(
  `Built ${packageMetadata.name} v${packageMetadata.version}: ` +
  'dist/lanes.css and dist/lanes.min.css',
);
