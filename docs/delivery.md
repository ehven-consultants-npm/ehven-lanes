# Dual-delivery contract

Every `@ehven/lanes` release must be usable through two first-class delivery paths:

1. Package-manager installation.
2. Direct acquisition of versioned CSS.

Neither path is a secondary or best-effort distribution.

## Single source

The sole authored CSS source is:

```text
src/lanes.css
```

The build creates:

```text
dist/lanes.css
dist/lanes.min.css
```

`dist/lanes.css` consists of an identifying license banner followed by the authored source.

`dist/lanes.min.css` consists of the same banner followed by a Lightning CSS-minified representation of the same source.

Generated files are never edited manually.

## Published artifacts

Each release contains:

| Artifact | npm tarball | GitHub Release |
|---|---:|---:|
| `lanes.css` | `dist/lanes.css` | `lanes.css` |
| `lanes.min.css` | `dist/lanes.min.css` | `lanes.min.css` |
| Package tarball | Registry artifact | `ehven-lanes-VERSION.tgz` |
| Checksums | Registry integrity metadata | `SHA256SUMS` |

The release workflow compares the CSS inside the packed npm tarball with the CSS destined for GitHub Release. Publication stops if either comparison fails.

## Package-manager delivery

Consumers install the public npm package:

```sh
pnpm add @ehven/lanes
```

The stable stylesheet subpaths are:

```text
@ehven/lanes/lanes.css
@ehven/lanes/lanes.min.css
```

The package root also resolves to the readable stylesheet for bundlers that support CSS package entry points.

## Direct delivery

### Canonical downloadable files

GitHub Release assets are the canonical downloadable files:

```text
https://github.com/ehven-consultants-npm/ehven-lanes/releases/download/vVERSION/lanes.css
https://github.com/ehven-consultants-npm/ehven-lanes/releases/download/vVERSION/lanes.min.css
https://github.com/ehven-consultants-npm/ehven-lanes/releases/download/vVERSION/SHA256SUMS
```

They are intended for downloading, verification, and self-hosting.

### npm-backed CDN convenience

Version-pinned CDN consumption is supported:

```text
https://cdn.jsdelivr.net/npm/@ehven/lanes@VERSION/dist/lanes.css
https://cdn.jsdelivr.net/npm/@ehven/lanes@VERSION/dist/lanes.min.css
```

This is convenient, but jsDelivr and npm remain third-party infrastructure.

Do not use:

```text
@latest
```

A moving production URL makes deployment output non-reproducible.

### Owned delivery endpoint

An owned Ehven delivery endpoint may be added later.

It must:

1. Serve the exact GitHub Release bytes without rewriting them.
2. Use a version-bearing immutable URL.
3. Return an appropriate `text/css` content type.
4. Publish the corresponding checksum.
5. Retain old released versions.
6. Avoid making `latest` the documented production path.
7. be treated as a mirror, not a separate build.

The hostname is deliberately not hard-coded until the endpoint is provisioned.

## Integrity verification

Download the desired file and checksum manifest from the same release.

On macOS:

```sh
grep ' lanes.min.css$' SHA256SUMS \
  | shasum -a 256 --check
```

On Linux:

```sh
grep ' lanes.min.css$' SHA256SUMS \
  | sha256sum --check
```

## Versioning

A CSS selector, exported path, or documented custom property is public API.

Breaking changes require a breaking SemVer release.

Every production installation should pin either:

- An exact npm version through its dependency manifest and lockfile.
- An exact version in its download or stylesheet URL.

## Failure handling

Published versions are immutable.

If a release is defective:

1. Do not overwrite its artifacts.
2. Deprecate the defective npm version when warranted.
3. Document the defect.
4. Publish a corrected version.
5. Retain the original GitHub Release as historical evidence.
