# npm-v7-resolutions

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Adds (limited) support for forcing npm v7 dependency resolutions.

Inspired by [this StackOverflow answer](https://stackoverflow.com/a/65014694).

## Installation

```shell
$ npm install -g @mythicdrops/npm-v7-resolutions
```

## Usage

### CLI

```shell
$ npm-v7-resolutions
```

### NodeJS

```typescript
import { resolutions } from "@mythicdrops/npm-v7-resolutions";

(async () => {
  await resolutions(process.cwd());
})();
```

## Development

### Commands

To run github-cdkactions, use:

```bash
npm start # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

To do a one-off build, use `npm run build` or `yarn build`.

To run tests, use `npm test` or `yarn test`.

### Configuration

Code quality is set up with `prettier`, `eslint`, and `husky`.

#### Jest

Jest tests are set up to run with `npm test` or `yarn test`.

#### Bundle Analysis

[`size-limit`](https://github.com/ai/size-limit) is set up to calculate the real cost of this library with `npm run size` and visualize the bundle with `npm run analyze`.

#### Rollup

TSDX uses [Rollup](https://rollupjs.org) as a bundler and generates multiple rollup configs for various module formats and build settings. See [Optimizations](#optimizations) for details.

#### TypeScript

`tsconfig.json` is set up to interpret `dom` and `esnext` types, as well as `react` for `jsx`. Adjust according to your needs.

### Continuous Integration

#### GitHub Actions

Two actions are added by default:

- `main` which installs deps w/ cache, lints, tests, and builds on all pushes against a Node and OS matrix
- `size` which comments cost comparison of your library on every pull request using [`size-limit`](https://github.com/ai/size-limit)

### Optimizations

Please see the main `tsdx` [optimizations docs](https://github.com/palmerhq/tsdx#optimizations). In particular, know that you can take advantage of development-only optimizations:

```typescript
// ./types/index.d.ts
declare var __DEV__: boolean;

// inside your code...
if (__DEV__) {
  console.log("foo");
}
```

You can also choose to install and use [invariant](https://github.com/palmerhq/tsdx#invariant) and [warning](https://github.com/palmerhq/tsdx#warning) functions.

### Module Formats

CJS, ESModules, and UMD module formats are supported.

The appropriate paths are configured in `package.json` and `dist/index.js` accordingly. Please report if any issues are found.

### Named Exports

Per Palmer Group guidelines, [always use named exports](https://github.com/palmerhq/typescript#exports).

## Publishing

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) in order to perform releases.
