# contentcredentials.org

This project generates the code for the contentcredentials.org site.

## Getting Started

### Prerequisites

Running this repo requires the following tools installed on your system:

- **[Node.js](https://nodejs.org/en)** - needed for the installation of packages, development tools, and build process
- **[pnpm](pnpm)** - package manager for Node.js with efficiency and speed in mind

We recommend [nvm](https://github.com/nvm-sh) for managing your Node.js install. You can follow [their instructions](https://github.com/nvm-sh/nvm#installing-and-updating) for installation.

Once Node.js is installed, you can install pnpm by running `npm install -g pnpm`, or by one of the methods described on their [installation page](https://pnpm.io/installation).

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

This will enable debug logging in the browser console for both the contentcredentials.org site as well as our [JavaScript SDK](https://github.com/contentauth/c2pa-js).

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
3. Once a PR is created, automated tests will run and a preview link will be created. Please make sure the end-to-end and/or unit tests pass and correct them if they are broken.
4. If any visual snapshot tests need attention, log in to [Percy](https://percy.io/85a19a76/contentcredentials.org) to review or correct unexpected visual changes (please comment on the PR if you need access to Percy).
5. Once automated tests are resolved, please signal that the PR is ready for review by removing the `wip` tag (if added) and requesting review from a CAI team member.
6. If the feature needs any product, design, or QE review, please send the preview link to the appropriate team members (the password to the site is available in the deploy preview PR comment).
7. Once tests pass and the PR has been approved by a [code owner](https://github.com/orgs/contentauth/teams/c2pa-js-committers/members), you can merge for auto-deployment to our [staging site](https://cc-dev.netlify.app/). [Squash and merge](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/merging-a-pull-request#merging-a-pull-request) is generally recommended for small-to-medium PRs with a single author. PRs encompassing larger features should get [rebased](https://docs.github.com/en/get-started/using-git/about-git-rebase) into logical and descriptive commits.

#### Definition of complete

- End-to-end or unit tests (where applicable) have been added that cover this change/bug fix
- Any UI changes display properly on mobile breakpoints
- Any user-visible strings have accompanying translation tags
- Accessibility support has been added
- Analytics are being sent (where applicable)

### Internationalization

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
