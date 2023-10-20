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

import { rest } from 'msw';

export const endpoints = {
  'manifest-recovery': 'https://cai-msb-stage.adobe.io/manifests/v1',
};

export default [
  rest.get(endpoints['manifest-recovery'], (_, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        results: [
          {
            url: 'https://cai-manifests.adobe.com/manifests/adobe-urn-uuid-be486f49-ea3d-406b-9a8a-ac24d192ab67/assets/thumbnail.jpeg',
            manifest_url:
              'https://cai-manifests.adobe.com/manifests/adobe-urn-uuid-be486f49-ea3d-406b-9a8a-ac24d192ab67',
            signed_on: '2023-06-13T11:16:40.888788837Z',
            matched_on_watermark: false,
          },
          {
            url: 'https://cai-manifests.adobe.com/manifests/adobe-urn-uuid-78f3bbb7-8b1e-48ef-95b4-93d8dd661c0d/assets/thumbnail.jpeg',
            manifest_url:
              'https://cai-manifests.adobe.com/manifests/adobe-urn-uuid-78f3bbb7-8b1e-48ef-95b4-93d8dd661c0d',
            signed_on: '2023-06-19T09:39:54.805432619Z',
            matched_on_watermark: false,
          },
        ],
      }),
    ),
  ),
];
