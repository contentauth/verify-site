<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import Link from '$src/components/typography/Link.svelte';
  import { _ } from 'svelte-i18n';
  import SubSection from '../../SubSection/SubSection.svelte';
  import AboutSectionIconContentRow from '../AboutSection/AboutSectionIconContentRow.svelte';

  export let blockchainData: {
    token_id: string;
    blockchain: {
      name: string;
      network: string;
      chain_id: number;
    };
    explorer_url: string;
    transaction_hash: string;
  };

  $: networkDisplay = `${blockchainData.blockchain.name} (${blockchainData.blockchain.network})`;
</script>

<SubSection>
  <svelte:fragment slot="title">
    {$_('sidebar.verify.process.blockchain', {
      default: 'Blockchain Record',
    })}</svelte:fragment>
  <div class="flex flex-col gap-2.5" slot="content">
    <AboutSectionIconContentRow>
      <svelte:fragment slot="content">
        <div class="flex flex-col gap-1">
          <div class="text-sm">
            <span class="text-gray-600">Network:</span>
            <span class="text-gray-900 font-medium">{networkDisplay}</span>
          </div>
          <div class="text-sm">
            <span class="text-gray-600">Token ID:</span>
            <span class="text-gray-900 font-medium"
              >{blockchainData.token_id}</span>
          </div>
          <div class="text-sm">
            <span class="text-gray-600">Transaction:</span>
            <span class="text-gray-900 font-mono text-xs break-all">
              {blockchainData.transaction_hash.slice(
                0,
                10,
              )}...{blockchainData.transaction_hash.slice(-8)}
            </span>
          </div>
          <div class="mt-2">
            <a
              href={blockchainData.explorer_url}
              target="_blank"
              rel="noreferrer"
              class="inline-flex items-center gap-1">
              <Link
                >{$_('sidebar.verify.process.viewOnExplorer', {
                  default: 'View on Explorer',
                })}</Link>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="text-blue-600">
                <path
                  d="M10.5 1.5L1.5 10.5M10.5 1.5H4.5M10.5 1.5V7.5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </svelte:fragment>
    </AboutSectionIconContentRow>
  </div>
</SubSection>
