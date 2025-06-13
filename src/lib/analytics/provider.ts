// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { nanoid } from '$lib/util/nanoid';
import type { Debugger } from 'debug';

export interface Config {
  debugger?: Debugger;
}

export type Attributes = Record<string, string | number>;

export abstract class AnalyticsProvider {
  readonly dbg;

  static USER_ID_LOCALSTORAGE_KEY = 'sessionId';

  constructor(config?: Config) {
    if (!this.dbg) {
      this.dbg = config?.debugger;
    }
  }

  abstract track(eventName: string, attributes?: Attributes): void;

  abstract trackError(error: string | Error, attributes?: Attributes): void;

  abstract identify(userId: string): void;

  getUserId() {
    const key = AnalyticsProvider.USER_ID_LOCALSTORAGE_KEY;
    const userId = localStorage.getItem(key);

    if (userId) {
      this.dbg?.('Using existing userId', { userId });

      return userId;
    }

    const newUserId = nanoid();
    this.dbg?.('Could not find userId, generated new one', { newUserId });
    localStorage.setItem(key, newUserId);

    return newUserId;
  }
}
