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

import type { AnalyticsPlugin as BaseAnalyticsPlugin } from 'analytics';

interface InitializeArgs<T> {
  config: T;
}

interface GeneralArgs<T> {
  payload: {
    anonymousId: string;
    userId: string;
    event?: string;
    properties: T;
    options: {
      plugins: Record<string, boolean>;
      action?: unknown;
    };
  };
}

type CorrectedApi<ConfigType, PayloadType> = {
  config: ConfigType;
  initialize: (args: InitializeArgs<ConfigType>) => void;
  page: (args: GeneralArgs<PayloadType>) => void;
  track: (args: GeneralArgs<PayloadType>) => void;
  identify: (args: GeneralArgs<PayloadType>) => void;
};

export type AnalyticsPlugin<ConfigType, PayloadType> = Partial<
  BaseAnalyticsPlugin & CorrectedApi<ConfigType, PayloadType>
>;
