# verify.contentauthenticity.org

This project generates the code for the verify.contentauthenticity.org site.

## Getting Started

### Prerequisites

Running this repo requires the following tools installed on your system:

- **[Node.js](https://nodejs.org/)** - needed for the installation of packages, development tools, and build process
- **[pnpm](https://pnpm.io/)** - package manager for Node.js with efficiency and speed in mind
- **[Git LFS](https://git-lfs.com/)** - large file storage for Git
- **[Rust](https://www.rust-lang.org/)** - needed to build the C2PA test image service

We recommend [nvm](https://github.com/nvm-sh) for managing your Node.js install. You can follow [their instructions](https://github.com/nvm-sh/nvm#installing-and-updating) for installation.

Once Node.js is installed, you can install pnpm by running `npm install -g pnpm`, or by one of the methods described on their [installation page](https://pnpm.io/installation).

Git LFS can be installed by following the instructions on their [home page](https://git-lfs.com/).

Rust can be installed by following the instructions on their [installation page](https://www.rust-lang.org/tools/install).

### Running locally

To run, check out this project and run:

```shell
nvm use # if using nvm
pnpm install
pnpm dev
```

### Runtime debugging

To view debug messages in the console, you can load your browser's inspector, go to the Console tab, and enter:

```js
// For all of the messages
localStorage.debug = '*';
// For just messages related to the toolkit and data store
localStorage.debug = 'toolkit,store';
// To turn off debug logs
localStorage.debug = false;
```

This will enable debug logging in the browser console for both the verify.contentauthenticity.org site as well as our [JavaScript SDK](https://github.com/contentauth/c2pa-js).

## Development

### Stack

We rely on the following tools/libraries to power the site:

- [SvelteKit](https://kit.svelte.dev/) is the main application framework that we use, offering a straightforward and modern development workflow. It handles everything from rendering options (e.g. static site generation) to state management and routing. They have excellent [documentation](https://kit.svelte.dev/docs/introduction) and [tutorials](https://learn.svelte.dev/tutorial/introducing-sveltekit) on getting started.
- [Svelte](https://svelte.dev/) is the front-end library used with SvelteKit, which offers an intuitive development experience and quick performance. It also has great [documentation](https://svelte.dev/docs/introduction) and comprehensive [tutorials](https://learn.svelte.dev/tutorial/welcome-to-svelte).
- [Vite](https://vitejs.dev/) manages our build process and provides ultra-fast compilation in development. Production builds are handled by [Rollup](https://rollupjs.org/) (as is standard with Vite projects).
- [Tailwind](https://tailwindcss.com/) is used for all of our CSS and provides a familiar framework for rapidly styling components. It also has wonderful [documentation](https://tailwindcss.com/docs/installation) and helpful [development tools](https://tailwindcss.com/docs/editor-setup).
- [c2pa.js](https://opensource.contentauthenticity.org/docs/js-sdk/getting-started/overview) contains our JavaScript SDK which allows sites to read and validate C2PA data on the client side using WebAssembly. It powers the functionality behind our Verify tool.

### Process

We use the following process when adding or updating functionality to the site:

1. Create a branch on the repo for development work that encapsulates a particular feature/change
2. Once the change is complete (see definition below), open up a pull request, and fill out the template. If a PR is not yet ready for review, please add the `wip` tag.
3. Once a PR is created, an automated dev deploy will run and a preview link will be created. Please make sure the end-to-end and/or unit tests pass and correct them if they are broken.
4. When you feel like the PR is ready enough to run visual tests (these are expensive so we don't do this automatically on every commit), add the `snapshot requested` tag to the PR and the snapshot tests will start to run. Once they are done GitHub will automatically remove the tag for you.
5. If any visual snapshot tests need attention, log in to [Percy](https://percy.io/85a19a76/contentcredentials.org) to review or correct unexpected visual changes (please comment on the PR if you need access to Percy).
6. Once automated tests are resolved, please signal that the PR is ready for review by removing the `wip` tag (if added) and requesting review from a CAI team member.
7. Once tests pass and the PR has been approved by a [code owner](https://github.com/orgs/contentauth/teams/c2pa-js-committers/members), you can merge. [Squash and merge](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/merging-a-pull-request#merging-a-pull-request) is generally recommended for small-to-medium PRs with a single author. PRs encompassing larger features should get [rebased](https://docs.github.com/en/get-started/using-git/about-git-rebase) into logical and descriptive commits.

#### Definition of complete

- End-to-end or unit tests (where applicable) have been added that cover this change/bug fix
- Any UI changes display properly on mobile breakpoints
- Any user-visible strings have accompanying translation tags
- Accessibility support has been added
- Analytics are being sent (where applicable)

### Per-environment configuration

We have separate builds for our different environments. You can specify a JSON-encoded `EnvConfig` object in the
`SITE_CONFIG` environment variable while building (or specify it in the `deploy.yaml` GitHub actions file for CI):

```ts
interface EnvConfig {
  env: 'local' | 'dev' | 'stage' | 'prod';
  features: ValidFeatures[];
  config: Record<string, unknown>;
}
```

For instance, to configure the output for deployment to stage, you would build with:

```shell
export SITE_CONFIG='{"env": "stage", "features": ["new-homepage"], "config": {"my-key":"my-val"}}';
```

#### Root trust list

The root trust list is available at `static/trust/anchors.pem`. This list should change infrequently.

This file is also where you add certificates with "Intermediate" type.

#### End-entity trust list

The end-entity trust list is contained in this repository in the `static/trust/allowed.pem` file.

When running `pnpm dev` or `pnpm build`, we call `pnpm hash-pem` which goes through the certs and creates a
static file containing the hashes of the certs in `static/trust/allowed.pem`. This is available on the
server as `static/trust/allowed.sha256.txt`.

To add a certificate, append PEM certificate(s) to `assets/certs/allowed.pem` along with a comment starting with a hash (`#`) mentioning who this certificate belongs to (please also prepend an `O=` to designate that this is the organization name), so it looks like:

```
# O=SAMPLE ORG NAME
```

**Note:** This must _exactly_ match the organization name specified in the certificate.

Then you can re-run the build to re-generate
`allowed.sha256.txt`, test locally, open up a PR with the change, make sure existing tests pass, and merge to deploy.

### Feature flagging

#### Creating a new feature flag

New feature flags need to be specified in the `validFeatures` array in `src/lib/config.ts`. You can check if a feature is enabled by doing the following:

```ts
import { getConfig } from '$lib/config';

const { features } = getConfig();

if (features.includes('my-feature')) {
  // Enabled feature logic
}
```

#### Setting feature flags

Feature flag settings come from one of three sources (sources later in the list will overwrite earlier sources):

1. The `defaultConfig.features` array in `src/lib/config.ts`
2. The `window.siteConfig.features` array that gets set from the environment configuration
3. Setting the `siteFeatures` local storage key by running the following in your browser console: `localStorage.setItem('siteFeatures', 'search-v2,!new-homepage')`. Note that the string is comma-delimited, and you can prefix features with `!` if you want to disable them locally if set in the default or environment configs.

#### Removing a feature flag

You will want to remove feature flags whenever a feature gets made into default functionality or if we remove a feature. When removing a feature flag, _please_:

- Remove the feature ID from the `validFeatures` array in `src/lib/config.ts`
- Remove any conditionals being used that checks for this (TypeScript should notify you of them if you do the previous step)

## Testing

Most of our testing is done through an end-to-end workflow, and are run via [Playwright](https://playwright.dev/). We rely heavily on snapshot testing to assert that the site behaves as expected. We use [Percy](https://percy.io/) to manage snapshot handling and visual review, which is automatically run for any PR commits.

The first time you run the tests, you need to run the following to install the browser engines so that Playwright can use them:

```shell
npx playwright install
```

Then, to run the tests, you can run:

```shell
# Build the site from the current code
pnpm build
# Run the test suite
pnpm test
```

### Local Percy debugging

Since we get a set number of screenshots with Percy, often is is both faster and more economical to preview screenshots
locally. To do this, you can run the snapshot tests with:

```shell
SNAPSHOT_DEBUG_MODE=1 pnpm run test:e2e
```

This will render all snapshots locally using Chrome with all of the widths declared in the Percy config and write the
rendered snapshots to the `snapshot-debug` directory.

## Contributions and feedback

We welcome contributions to this project. For information on contributing, providing feedback, and about ongoing work, see [Contributing](https://github.com/contentauth/verify-site/blob/main/CONTRIBUTING.md). For additional information on testing, see [Contributing to the project](https://github.com/contentauth/verify-site/blob/main/docs/project-contributions.md).

## License

This project is distributed under the terms of the [Apache License (Version 2.0)](https://github.com/contentauth/verify-site/blob/main/LICENSE-APACHE).

Some components and dependent crates are licensed under different terms; please check their licenses for details.
