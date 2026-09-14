# Installation workflows

`@ehven/lanes` is a CSS package. The HTML contract is the same on every platform:

```html
<div class="ehven-lanes">
  <article>First item</article>
  <article>Second item</article>
  <article>Third item</article>
</div>
```

Only direct children become lane items.

## Package-manager installation

Install with the package manager already used by the project.

### pnpm

```sh
pnpm add @ehven/lanes
```

### npm

```sh
npm install @ehven/lanes
```

### Yarn

```sh
yarn add @ehven/lanes
```

Import the readable stylesheet:

```css
@import '@ehven/lanes/lanes.css';
```

Importing the package root is also supported by compatible bundlers:

```css
@import '@ehven/lanes';
```

The explicit `/lanes.css` subpath is recommended because it states the asset type clearly.

## Cascade layers

The package does not declare its own cascade layer. A consuming project may assign one:

```css
@layer reset, tokens, base, layout, components, utilities;

@import '@ehven/lanes/lanes.css' layer(layout);
```

This lets each project retain control of its cascade architecture.

## Astro

Install the package:

```sh
pnpm add @ehven/lanes
```

Import it from a global project stylesheet:

```css
@import '@ehven/lanes/lanes.css' layer(layout);
```

Then use the class in any `.astro` component:

```astro
<section class="ehven-lanes">
  {
    items.map((item) => (
      <article>
        <h2>{item.title}</h2>
        <p>{item.description}</p>
      </article>
    ))
  }
</section>
```

No Astro integration or hydrated client component is required.

## Starlight

Import the package through a stylesheet already registered in Starlight's `customCss` configuration.

For example:

```css
/* src/styles/starlight.css */
@import '@ehven/lanes/lanes.css' layer(layout);
```

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Documentation',
      customCss: [
        './src/styles/starlight.css',
      ],
    }),
  ],
});
```

The class can then be used in Astro components, MDX components, or supported HTML markup within documentation content.

## WordPress with a Node build

Install the package in the theme or plugin project:

```sh
pnpm add @ehven/lanes
```

Import it through the project's primary CSS entry point:

```css
@import '@ehven/lanes/lanes.css';
```

Let the existing build system generate the public theme or plugin asset.

## WordPress without a Node build

Download `lanes.min.css` from a versioned GitHub Release and store it locally, for example:

```text
assets/vendor/ehven-lanes/lanes.min.css
```

Enqueue it from a theme:

```php
<?php

add_action(
    'wp_enqueue_scripts',
    static function (): void {
        wp_enqueue_style(
            'ehven-lanes',
            get_theme_file_uri(
                '/assets/vendor/ehven-lanes/lanes.min.css'
            ),
            array(),
            '0.1.0'
        );
    }
);
```

Self-hosting the versioned file avoids making page rendering depend on a third-party CDN.

## Static HTML

Download and store the stylesheet with the site:

```html
<link
  rel="stylesheet"
  href="/assets/vendor/ehven-lanes/lanes.min.css"
/>
```

Alternatively, use the version-pinned npm CDN URL:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@ehven/lanes@0.1.0/dist/lanes.min.css"
/>
```

## Webflow

Add the version-pinned stylesheet link to the project's site-wide `<head>` custom code:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@ehven/lanes@0.1.0/dist/lanes.min.css"
/>
```

Add `ehven-lanes` to the Webflow element that wraps the peer items.

For stronger delivery-chain control, replace the CDN URL with an owned public asset endpoint after that service is provisioned.

## Configuration

Set package custom properties on the lanes container or any ancestor:

```css
.portfolio-list {
  --ehven-lanes-lane-minimum: 20rem;
  --ehven-lanes-gap: 1.5rem;
  --ehven-lanes-flow-tolerance: 4rem;
}
```

Custom properties inherit, so site-wide defaults may be established at `:root`:

```css
:root {
  --ehven-lanes-lane-minimum: 18rem;
  --ehven-lanes-gap: 1rem;
}
```

## Lists

The package deliberately does not reset list styling. If a list is used as the container, reset it in project CSS when appropriate:

```css
ul.ehven-lanes {
  margin: 0;
  padding: 0;
  list-style: none;
}
```

## Item margins

The package uses the direct children's block-end margin to create vertical separation in the Multi-column fallback. Native Grid Lanes replaces that margin with `gap`.

Treat each direct child as the layout item. If content needs independent outer margins, place that content inside a direct-child wrapper.
