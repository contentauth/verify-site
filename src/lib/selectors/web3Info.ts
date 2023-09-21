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

// import type { Manifest } from 'c2pa';

// export function web3Info(manifest: Manifest): string | null {
//   const cryptoEntries =
//     manifest.assertions.get('adobe.crypto.addresses')[0]?.data ?? {};

//   return (Object.entries(cryptoEntries) as [string, string[]][]).filter(
//     ([type, [address]]) => address && ['solana', 'ethereum'].includes(type),
//   );

//   return null;
// }
