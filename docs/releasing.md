# Release workflow

## Toolchain

The maintained release toolchain is:

- Node.js 24.19.0
- npm 11.5.1 or later
- pnpm 11.22.0

npm Trusted Publishing currently requires npm 11.5.1 or later and Node.js 22.14.0 or later.

## Repository preparation

Before the first release:

1. Add all scaffold files.
2. Run `pnpm install`.
3. Commit the generated `pnpm-lock.yaml`.
4. Run `pnpm run check`.
5. Push `main`.
6. Confirm the CI workflow passes.

Recommended GitHub controls:

- Prevent force-pushes to `main`.
- Prevent deletion of `main`.
- Require the CI check before merging.
- Protect release tags matching `v*`.
- Create an environment named `npm-production`.
- Require approval for the `npm-production` environment.

## Initial npm bootstrap

npm exposes Trusted Publisher settings through an existing package's settings. Therefore, this package uses one manual publication to establish `@ehven/lanes`.

Authenticate locally:

```sh
npm login
npm whoami
```

Confirm package contents:

```sh
pnpm run check
```

Publish the initial public package:

```sh
npm publish --access public
```

This publishes version `0.1.0` and runs the `prepack` build automatically.

This manual first publication is the bootstrap exception. It will not receive the automatic OIDC provenance attached to later workflow publications.

## Configure npm Trusted Publishing

After `@ehven/lanes` exists on npm, open its package settings and add a GitHub Actions Trusted Publisher with these exact values:

| Setting | Value |
|---|---|
| Organization or user | `ehven-consultants-npm` |
| Repository | `ehven-lanes` |
| Workflow filename | `release.yml` |
| Environment | `npm-production` |
| Allowed action | `npm publish` |

Enter only `release.yml`, not `.github/workflows/release.yml`.

After one OIDC release succeeds:

1. Open the package's Publishing Access settings.
2. Require two-factor authentication.
3. Disallow traditional publishing tokens.
4. Remove any unused npm automation token.

The workflow uses GitHub-hosted runners and `id-token: write`. It does not use `NODE_AUTH_TOKEN`.

## Complete the initial GitHub release

After the manual npm publication and Trusted Publisher configuration:

```sh
git tag -a v0.1.0 -m "Release v0.1.0"
git push origin v0.1.0
```

Approve the `npm-production` environment deployment when GitHub requests it.

The release workflow detects that `@ehven/lanes@0.1.0` already exists, skips duplicate npm publication, and creates the matching GitHub Release assets.

## Subsequent releases

### 1. Update the version

For a patch release:

```sh
pnpm version patch --no-git-tag-version
```

For a minor release:

```sh
pnpm version minor --no-git-tag-version
```

For a major release:

```sh
pnpm version major --no-git-tag-version
```

### 2. Update documentation

Update:

- `CHANGELOG.md`
- README examples containing a versioned URL
- Documentation containing a versioned URL
- Migration instructions when public API changes

### 3. Verify

```sh
pnpm install
pnpm run check
git diff --check
git status
```

### 4. Commit and push `main`

```sh
git add .
git commit -m "Prepare release vVERSION"
git push origin main
```

Wait for CI to pass.

### 5. Create the release tag

```sh
git tag -a vVERSION -m "Release vVERSION"
git push origin vVERSION
```

The tag must exactly equal `v` followed by the version in `package.json`.

### 6. Approve publication

Approve the protected `npm-production` GitHub environment.

The workflow then:

1. Confirms the tag commit belongs to `main`.
2. Confirms the tag matches `package.json`.
3. Installs locked dependencies.
4. Builds both CSS artifacts.
5. Runs tests.
6. Inspects the npm package.
7. Packs the npm tarball.
8. Compares tarball CSS with release CSS.
9. Generates SHA-256 checksums.
10. Publishes to npm through OIDC.
11. Creates the corresponding GitHub Release.
12. Uploads the CSS, tarball, and checksum manifest.

Trusted Publishing automatically generates npm provenance for public packages built from public repositories.

## Post-release verification

```sh
npm view @ehven/lanes@VERSION version
npm view @ehven/lanes@VERSION dist.integrity
gh release view vVERSION \
  --repo ehven-consultants-npm/ehven-lanes
```

Test package installation in a disposable project before upgrading production consumers.

## Rerunning a release

The workflow is idempotent:

- It skips npm publication if that exact version already exists.
- It creates a missing GitHub Release.
- It replaces incomplete release assets when rerun.

This permits recovery when npm publication succeeds but GitHub Release creation is interrupted.

## Rollback

Published package versions and release assets are immutable.

For a defective release:

1. Stop dependent deployments.
2. Deprecate the defective npm version if necessary.
3. Restore the last known-good exact version in consumers.
4. Correct the source.
5. Publish a new version.
6. Document the resolution in `CHANGELOG.md`.
