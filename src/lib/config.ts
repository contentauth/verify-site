// ADOBE CONFIDENTIAL
// Copyright 2023 Adobe
// All Rights Reserved.
//
// NOTICE: All information contained herein is, and remains
// the property of Adobe and its suppliers, if any. The intellectual
// and technical concepts contained herein are proprietary to Adobe
// and its suppliers and are protected by all applicable intellectual
// property laws, including trade secret and copyright laws.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe.

import { version } from '$app/environment';
import debug from 'debug';
import { memoize, merge } from 'lodash';

const dbg = debug('config');

declare global {
  interface Window {
    siteConfig: EnvConfig;
  }
}

export const APP_NAME = 'contentcredentials.org';
export const SITE_VERSION = version;
export const DATA_PRIVACY_URL =
  'https://contentauthenticity.org/faq#:~:text=Why%20is%20there%20a%20gap%20in%20an%20image%E2%80%99s%20CAI%20data%3F';
export const LEARN_MORE_URL = 'https://contentauthenticity.org/';

interface EnvConfig {
  env: 'local' | 'dev' | 'stage' | 'prod';
  config: Record<string, unknown>;
}

const defaultConfig: EnvConfig = {
  env: 'prod',
  config: {},
};

export const getConfig = memoize<() => EnvConfig>(() => {
  const config = merge({}, defaultConfig, window.siteConfig);
  dbg('Loaded config', config);

  return config;
});

export const SITE_ENV = getConfig().env;
