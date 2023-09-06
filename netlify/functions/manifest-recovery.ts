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

import type { Handler, HandlerEvent } from '@netlify/functions';

const mockResult = {
  results: [
    {
      url: 'https://cai-manifests.adobe.com/manifests/adobe-urn-uuid-103ea0ee-be7c-4f18-875e-62d3e73bd9b0/assets/thumbnail.jpeg',
      signed_on: '2023-04-18T10:01:26.897345439Z',
    },
    {
      url: 'https://cai-manifests.adobe.com/manifests/adobe-urn-uuid-dbec50fc-6e39-4503-ad97-acaee9ca610f/assets/thumbnail.jpeg',
      signed_on: '2023-05-24T09:02:50.244234164Z',
    },
    {
      url: 'https://cai-manifests.adobe.com/manifests/adobe-urn-uuid-e5a86993-90dc-47dc-9df8-9bfbbe194084/assets/thumbnail.jpeg',
      signed_on: '2023-06-13T10:07:38.918220828Z',
    },
    {
      url: 'https://cai-manifests.adobe.com/manifests/adobe-urn-uuid-92eedc1c-d225-4ab9-9c5a-6a7391b534c4/assets/thumbnail.jpeg',
      signed_on: '2023-06-13T10:08:14.545569857Z',
    },
    {
      url: 'https://cai-manifests.adobe.com/manifests/adobe-urn-uuid-db5fa8bf-af55-4eed-bf43-78cf1f3d3b38/assets/thumbnail.jpeg',
      signed_on: '2023-08-01T11:16:34.893869041Z',
    },
  ],
};

const headers = {
  'Content-Type': 'application/json',
};

const handler: Handler = async (event: HandlerEvent) => {
  const path = event.path.replace(/\/*$/, '');

  if (path.endsWith('/manifests/v1')) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(mockResult),
    };
  } else if (path.endsWith('/sign_upload/v1')) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        filename: 'mock-upload.jpg',
        url: `/.netlify/functions/manifest-recovery/mock_upload`,
      }),
    };
  } else if (path.endsWith('/mock_upload')) {
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 200,
    };
  }

  return {
    statusCode: 404,
  };
};

export { handler };
