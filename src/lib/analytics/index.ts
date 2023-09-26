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

import { nanoid } from '$lib/util/nanoid';
import Analytics from 'analytics';
import debug from 'debug';
import dunamis from './plugins/dunamis';
import newrelic from './plugins/newrelic';

const MCID_GUID_LOCALSTORAGE_KEY = 'mcid_guid';
const dbg = debug('ingest');

/**
 * Create visitor ID (mcid_guid) so we can identify unknown users
 * @returns alphanumeric unique ID
 */
function getMcidGuid() {
  if (localStorage.getItem(MCID_GUID_LOCALSTORAGE_KEY)) {
    dbg('Using existing mcid_guid');
  } else {
    dbg('Could not find mcid_guid, generating');
    localStorage.setItem(MCID_GUID_LOCALSTORAGE_KEY, nanoid());
  }

  return localStorage.getItem(MCID_GUID_LOCALSTORAGE_KEY);
}

export const analytics = Analytics({
  app: 'verify',
  debug: true,
  plugins: [dunamis(), newrelic()],
});

analytics.identify(
  getMcidGuid(),
  {},
  {
    plugins: {
      dunamis: true,
      newrelic: true,
    },
  },
);
