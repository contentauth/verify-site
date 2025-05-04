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

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production

import { redirect } from '@sveltejs/kit';

export const prerender = true;

export function load() {
  throw redirect(308, '/verify');
}
