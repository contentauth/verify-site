// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Manifest } from 'c2pa';

export type NFTInfo = {
  token_id: string;
  blockchain: {
    name: string;
    network: string;
    chain_id: number;
  };
  explorer_url: string;
  transaction_hash: string;
};

export function selectNFTInfo(manifest: Manifest): NFTInfo | null {
  // Access the raw assertion data to find custom c2pa.nft assertion
  const rawAssertions = manifest.assertions.data;

  // Debug: Log all assertion labels to see what's available
  console.log(
    '[NFT Debug] Available assertions:',
    rawAssertions.map((a) => a.label),
  );
  console.log('[NFT Debug] Raw assertions data:', rawAssertions);

  // Find the c2pa.nft assertion in the raw data
  // Check both with and without the 'c2pa.' prefix as it might be stored differently
  const nftAssertion = rawAssertions.find((assertion) => {
    const label = assertion.label || '';

    return (
      label === 'c2pa.nft' ||
      label === 'nft' ||
      label.startsWith('c2pa.nft__') ||
      label.startsWith('nft__')
    );
  });

  if (nftAssertion) {
    console.log('[NFT Debug] Found NFT assertion:', nftAssertion);

    const nftData = nftAssertion.data;

    // Validate that the data has the expected structure
    if (
      typeof nftData === 'object' &&
      'token_id' in nftData &&
      'blockchain' in nftData &&
      'explorer_url' in nftData &&
      'transaction_hash' in nftData
    ) {
      console.log('[NFT Debug] Valid NFT data found:', nftData);

      return nftData as NFTInfo;
    } else {
      console.log('[NFT Debug] NFT data missing required fields:', nftData);
    }
  } else {
    console.log('[NFT Debug] No NFT assertion found');
  }

  return null;
}
