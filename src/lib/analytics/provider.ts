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
