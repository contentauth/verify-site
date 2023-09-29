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

import debug from 'debug';
import { AnalyticsProvider, type Attributes } from './provider';
import { NewRelicProvider } from './providers/newrelic';

const dbg = debug('analytics');

class Analytics extends AnalyticsProvider {
  readonly providers: AnalyticsProvider[];

  constructor(providers: AnalyticsProvider[]) {
    super();

    this.providers = providers;
  }

  track(eventName: string, attributes?: Attributes | undefined): void {
    this.providers.forEach((provider) => {
      provider.track(eventName, attributes);
    });
  }

  trackError(error: string | Error, attributes?: Attributes | undefined): void {
    this.providers.forEach((provider) => {
      provider.trackError(error, attributes);
    });
  }

  identify(userId: string): void {
    this.providers.forEach((provider) => {
      provider.identify(userId);
    });
  }
}

function initialize() {
  const providers = [new NewRelicProvider({ debugger: dbg })];

  return new Analytics(providers);
}

export const analytics = initialize();
