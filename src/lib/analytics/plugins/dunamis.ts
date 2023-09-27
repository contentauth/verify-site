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

import { SITE_VERSION } from '$lib/config';
import { nanoid } from '$lib/util/nanoid';
import Ingest from '@ccx-public/ingest';
import difference from 'lodash/difference';
import merge from 'lodash/merge';
import type { AnalyticsPlugin } from './types';

const config = 'dev';

function createCommonPayload(userId: string) {
  return {
    'event.dts_end': new Date(),
    'event.guid': nanoid(),
    'event.mcid_guid': userId,
    'event.language': navigator.language,
    'event.offline': !navigator.onLine,
    'event.referrer': document.referrer,
    'event.url': location.href,
  } as Partial<IngestPayload>;
}

export interface IngestPayload {
  'env.svc.name': string;
  'env.svc.version': string;
  'event.category': string;
  'event.context_guid': string;
  'event.dts_end': Date;
  'event.error_code': string;
  'event.error_desc': string;
  'event.error_type': string;
  'event.guid': string;
  'event.language': string;
  'event.mcid_guid': string;
  'event.offline': boolean;
  'event.referrer': string;
  'event.subcategory': string;
  'event.subtype': 'page' | 'verify' | 'legacy_verify' | 'learn' | 'faq';
  'event.type': 'render' | 'success' | 'legacy_cc' | 'error' | 'click';
  'event.user_agent': string;
  'event.url': string;
  'event.value': number | string;
  'event.workflow': string;
  'source.name': string;
  'ui.view_type': 'link' | 'upload';
}

const eventDefaults: Partial<IngestPayload> = {
  'env.svc.name': 'verify',
  'env.svc.version': SITE_VERSION,
  'event.category': 'WEB',
  'event.subcategory': 'Verify',
  'event.user_agent': navigator.userAgent,
  'event.workflow': 'Home',
  'source.name': 'CAI',
};

const requiredEvents = ['event.type'];

const defaultConfig = {
  dependencies: {
    getAccessToken(callback: (arg: unknown) => void) {
      callback(null);
    },
  },

  options: {
    ENVIRONMENT: 'dev', // 'prod', 'stage', or 'dev' (default is 'prod')
    ALLOW_NO_TOKEN: true, // Optional - set to allow events to be sent without a token
    ANALYTICS_API_KEY: 'cai-web-service', // Required
    ANALYTICS_PROJECT: 'cai-web-service', // Required
    ANALYTICS_X_PRODUCT: `cai-verify-site/${SITE_VERSION}`, // Required
    ANALYTICS_USER_AGENT: navigator.userAgent,
    ANALYTICS_MAX_QUEUED_EVENTS: 50, // Optional - default is max queue of 50 events
    ANALYTICS_DEBOUNCE: 10, // Optional - default is to send no faster than every 10 seconds
    ANALYTICS_USER_REGION: 'UNKNOWN', // Optional - set the x-user-region header (default is 'UNKNOWN')
    ANALYTICS_INGEST_TYPE: 'dunamis', // Optional - only change this if you know what you're doing
    TIMESTAMP_PROPERTY_NAME: 'event.dts_end', // Optional - only change this if you know what you're doing (override SDM)
  },
};

type DunamisConfig = typeof defaultConfig;

export default function dunamis(): AnalyticsPlugin<
  DunamisConfig,
  IngestPayload
> {
  let common: Partial<IngestPayload> | undefined;
  let ingest: InstanceType<typeof Ingest>;

  return {
    name: 'dunamis',
    config: { ...defaultConfig, config } as DunamisConfig,
    initialize: ({ config }) => {
      ingest = new Ingest(config.dependencies, config.options);
      ingest.enable(true);
    },
    track: ({ payload }) => {
      if (common != null) {
        const trackPayload = merge(
          common,
          eventDefaults,
          payload.properties,
        ) as IngestPayload;
        const missing = difference(requiredEvents, Object.keys(trackPayload));

        if (missing.length) {
          throw new Error(
            `Attempting to send payload with missing required data`,
          );
        }

        ingest?.postEvent(trackPayload, (err: unknown) => {
          if (err) {
            console.warn('Error posting event to ingest', err);
          }
        });
      } else {
        console.warn('The common payload is null');
      }
    },
    //creates common object with the userid used in postEvent
    identify: ({ payload }) => {
      common = createCommonPayload(payload.userId);
    },
  };
}
