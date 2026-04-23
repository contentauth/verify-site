// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { describe, expect, it } from 'vitest';
import type { Manifest } from 'c2pa';
import { selectNFTInfo } from './nftInfo';

describe('selectNFTInfo', () => {
  it('should extract NFT information from c2pa.nft assertion', () => {
    const mockManifest = {
      assertions: {
        data: [
          {
            label: 'c2pa.nft',
            data: {
              token_id: '9',
              blockchain: {
                name: 'firmachain',
                network: 'testnet',
                chain_id: 1337,
              },
              explorer_url:
                'https://explorer-testnet.firmachain.dev/transactions/488714A76188BCE587697FD7E27A3EAD2F1BCDF2E47D9E30B6A1C5B6784CA4FA',
              transaction_hash:
                '488714A76188BCE587697FD7E27A3EAD2F1BCDF2E47D9E30B6A1C5B6784CA4FA',
            },
          },
        ],
      },
    } as unknown as Manifest;

    const result = selectNFTInfo(mockManifest);

    expect(result).toEqual({
      token_id: '9',
      blockchain: {
        name: 'firmachain',
        network: 'testnet',
        chain_id: 1337,
      },
      explorer_url:
        'https://explorer-testnet.firmachain.dev/transactions/488714A76188BCE587697FD7E27A3EAD2F1BCDF2E47D9E30B6A1C5B6784CA4FA',
      transaction_hash:
        '488714A76188BCE587697FD7E27A3EAD2F1BCDF2E47D9E30B6A1C5B6784CA4FA',
    });
  });

  it('should handle c2pa.nft assertion with index suffix', () => {
    const mockManifest = {
      assertions: {
        data: [
          {
            label: 'c2pa.nft__1',
            data: {
              token_id: '123',
              blockchain: {
                name: 'ethereum',
                network: 'mainnet',
                chain_id: 1,
              },
              explorer_url: 'https://etherscan.io/tx/0xabc123',
              transaction_hash: '0xabc123',
            },
          },
        ],
      },
    } as unknown as Manifest;

    const result = selectNFTInfo(mockManifest);

    expect(result).toEqual({
      token_id: '123',
      blockchain: {
        name: 'ethereum',
        network: 'mainnet',
        chain_id: 1,
      },
      explorer_url: 'https://etherscan.io/tx/0xabc123',
      transaction_hash: '0xabc123',
    });
  });

  it('should return null when no NFT assertion exists', () => {
    const mockManifest = {
      assertions: {
        data: [
          {
            label: 'c2pa.actions',
            data: {},
          },
        ],
      },
    } as unknown as Manifest;

    const result = selectNFTInfo(mockManifest);

    expect(result).toBeNull();
  });

  it('should return null when NFT data is incomplete', () => {
    const mockManifest = {
      assertions: {
        data: [
          {
            label: 'c2pa.nft',
            data: {
              token_id: '9',
              // Missing required fields
            },
          },
        ],
      },
    } as unknown as Manifest;

    const result = selectNFTInfo(mockManifest);

    expect(result).toBeNull();
  });
});
