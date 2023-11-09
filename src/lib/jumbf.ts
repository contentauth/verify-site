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

const JUMBF_REGEX = /^self#jumbf=(\/c2pa\/)?(.*)/;
const ABSOLUTE_JUMBF_REGEX = /^self#jumbf=\/c2pa\/(.*)/;

export function normalizeUri(uri: string, manifestUri: string) {
  const [, absolutePrefix, rest] = JUMBF_REGEX.exec(uri) ?? [];

  if (absolutePrefix) {
    return uri;
  } else {
    return [manifestUri, rest].join('/');
  }
}

export function isJumbfUri(uri: string) {
  return JUMBF_REGEX.test(uri);
}

export function isAbsoluteJumbfUri(uri: string) {
  return ABSOLUTE_JUMBF_REGEX.test(uri);
}
