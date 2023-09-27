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
import type NewRelicBrowser from 'new-relic-browser';
import type { AnalyticsPlugin } from './types';

declare global {
  interface Window {
    newrelic: typeof NewRelicBrowser;
  }
}

type NewRelicAction = 'addPageAction' | 'noticeError' | 'setCustomAttribute';

interface NewRelicParams {
  action?: NewRelicAction;
  name?: string;
  attributes?: Record<string, string | number>;
  params?: unknown[];
}

function callNewRelic({
  action = 'addPageAction',
  name,
  attributes,
  params,
}: NewRelicParams) {
  const event = window.newrelic?.[action];

  if (event) {
    if (name && attributes) {
      event(name, attributes);
    } else if (name && params) {
      event(name, params);
    } else if (name) {
      event(name);
    } else {
      event(params);
    }
  } else {
    throw new Error(`No corresponding function found in NewRelic`);
  }
}

export default function newrelic(): AnalyticsPlugin<{}, NewRelicParams> {
  return {
    name: 'newrelic',
    config: {},
    initializeStart: () => {
      window.newrelic?.addRelease('cai-verify-site', SITE_VERSION);
    },
    track: ({ payload }) => {
      const trackPayload = payload.properties;
      const options = payload.options;
      options?.plugins?.dunamis
        ? callNewRelic({ name: payload.event, attributes: payload.properties }),
        : callNewRelic({
            action: options.action as string,
            name: trackPayload.name,
            attributes: trackPayload.attributes,
            params: trackPayload.params,
          });
    },
    // creates common object with the userid used in postEvent
    identify: ({ payload }) => {
      window.newrelic?.setCustomAttribute('userId', payload.userId);
    },
  };
}
