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

interface NewRelicParams {
  action?: 'addPageAction' | 'noticeError' | 'setCustomAttribute';
  name?: string;
  attributes?: Record<string, unknown>;
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

//refactors the dunamis payload to send it to newrelic
function dunamisToNewRelic(payload) {
  callNewRelic({ name: payload.event, attributes: payload.properties });
}

export default function newrelic() {
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
        ? dunamisToNewRelic(payload)
        : callNewRelic({
            action: options.action,
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
