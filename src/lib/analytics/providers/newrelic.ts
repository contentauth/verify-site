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

import { APP_NAME, SITE_ENV, SITE_VERSION } from '$src/lib/config';
import type NewRelicBrowser from 'new-relic-browser';
import { AnalyticsProvider, type Attributes } from '../provider';

declare global {
  interface Window {
    newrelic: typeof NewRelicBrowser;
  }
}

export class NewRelicProvider extends AnalyticsProvider {
  readonly dbg;
  readonly sdk: typeof NewRelicBrowser | undefined;

  constructor(config: ConstructorParameters<typeof AnalyticsProvider>[0]) {
    super(config);

    this.dbg = config?.debugger?.extend('newrelic');

    // Don't send metrics when running locally
    if (SITE_ENV === 'local') {
      this.dbg?.(`Skipping data calls in ${SITE_ENV} environment`);
    } else {
      this.sdk = window.newrelic;
    }

    this.sdk?.addRelease(APP_NAME, SITE_VERSION);
    this.sdk?.setCustomAttribute('env', SITE_ENV);

    this.identify(this.getUserId());
  }

  track(eventName: string, attributes?: Attributes): void {
    this.dbg?.('track', eventName, attributes);
    this.sdk?.addPageAction(eventName, attributes ?? {});
  }

  trackError(error: string | Error, attributes?: Attributes): void {
    this.dbg?.('trackError', error, attributes);
    this.sdk?.noticeError(error, attributes ?? {});
  }

  identify(userId: string): void {
    this.dbg?.('identify', userId);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Not sure why this isn't in the TypeScript definitions
    this.sdk?.setUserId(userId);
  }
}
