// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { version } from '$app/environment';
import debug from 'debug';
import { concat, flow, memoize, merge, partition } from 'lodash';
import { intersection, sortBy, uniq, without } from 'lodash/fp';

const dbg = debug('config');

declare global {
  interface Window {
    siteConfig: EnvConfig;
  }
}

export const SITE_VERSION = version;
export const DATA_PRIVACY_URL =
  'https://contentauthenticity.org/faq#:~:text=Why%20is%20there%20a%20gap%20in%20an%20image%E2%80%99s%20CAI%20data%3F';
export const LEARN_MORE_URL = 'https://contentauthenticity.org/';
const FEATURES_LOCALSTORAGE_KEY = 'siteFeatures';

interface EnvConfig {
  env: 'local' | 'dev' | 'stage' | 'prod';
  features: ValidFeatures[];
  config: Record<string, unknown>;
}

const defaultConfig: EnvConfig = {
  env: 'prod',
  features: [],
  config: {},
};

/** Any current valid features need to be set here */
export const validFeatures = ['homepage'] as const;

export type ValidFeatures = (typeof validFeatures)[number];

export function getLocalFeatures() {
  return localStorage.getItem(FEATURES_LOCALSTORAGE_KEY)?.split(',') ?? [];
}

export const getConfig = memoize<() => EnvConfig>(() => {
  const localFeatures = getLocalFeatures();
  const [disabledLocalFeatures, enabledLocalFeatures] = partition(
    localFeatures as ValidFeatures[],
    (x) => x.startsWith('!'),
  );
  const config = merge({}, defaultConfig, window.siteConfig);
  const features = flow(
    intersection(validFeatures),
    uniq,
    without(disabledLocalFeatures.map((x) => x.replace(/^!/, ''))),
    sortBy((x) => x),
  )(concat(config.features, enabledLocalFeatures)) as ValidFeatures[];
  const resolvedConfig = { ...config, features };

  dbg('Loaded features', resolvedConfig.features, {
    default: defaultConfig.features,
    siteConfig: window.siteConfig?.features,
    local: {
      all: localFeatures,
      enabled: enabledLocalFeatures,
      disabled: disabledLocalFeatures,
    },
  });
  dbg('Resolved config', resolvedConfig);

  return resolvedConfig;
});

export const SITE_ENV = getConfig().env;
