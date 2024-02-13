// ADOBE CONFIDENTIAL
// Copyright 2024 Adobe
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

import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';

const PEM_INPUT_PATH = 'assets/certs/allowed.pem';
const HASH_OUTPUT_PATH = 'static/allowed.txt';

const PEM_REGEX =
  /(?:-{5,}BEGIN CERTIFICATE-{5,}\n)([A-Za-z0-9+/\n]*={0,3})\n(?:-{5,}END CERTIFICATE-{5,})/gm;

async function run() {
  const pemBuffer = await fs.readFile(PEM_INPUT_PATH);
  // Normalize UNIX/Windows line endings
  const pemData = pemBuffer.toString().replaceAll('\r\n', '\n');
  const certs = Array.from(pemData.matchAll(PEM_REGEX))?.map(([, b64Cert]) => {
    const hash = createHash('sha256');
    const buf = Buffer.from(b64Cert, 'base64');
    hash.update(buf);

    return hash.digest('base64');
  });

  return fs.writeFile(HASH_OUTPUT_PATH, certs.join('\n'));
}

run();
