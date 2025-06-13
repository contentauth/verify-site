// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

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
