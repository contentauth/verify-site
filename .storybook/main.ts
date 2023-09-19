import type { StorybookConfig } from '@storybook/sveltekit';
import { mergeConfig } from 'vite';
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|svelte|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-svelte-csf',
    'storybook-addon-designs',
  ],
  framework: {
    name: '@storybook/sveltekit',
    options: {},
  },
  docs: {
    autodocs: true,
  },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      server: {
        fs: {
          allow: ['assets', 'locales'],
        },
      },
    });
  },
};
export default config;
