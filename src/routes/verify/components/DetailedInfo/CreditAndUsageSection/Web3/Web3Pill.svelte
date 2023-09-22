<!--
  ADOBE CONFIDENTIAL
  Copyright 2023 Adobe
  All Rights Reserved.
  NOTICE: All information contained herein is, and remains
  the property of Adobe and its suppliers, if any. The intellectual
  and technical concepts contained herein are proprietary to Adobe
  and its suppliers and are protected by all applicable intellectual
  property laws, including trade secret and copyright laws.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe.
-->
<script lang="ts">
  import EthereumLogo from '$assets/svg/color/logos/crypto-eth.svg?component';
  import SolanaLogo from '$assets/svg/color/logos/crypto-sol.svg?component';
  import Body from '$src/components/typography/Body.svelte';
  import SmallDescription from '$src/components/typography/SmallDescription.svelte';
  import { _ } from 'svelte-i18n';

  export let type: string;
  export let address: string;

  let hidden = true;
  const HIDE_DELAY = 800;

  $: truncatedAddress = `${address.slice(0, 6)}...${address.slice(-5)}`;

  function handleClick(address: string) {
    navigator.clipboard.writeText(address);
    hidden = false;
    setTimeout(() => {
      hidden = true;
    }, HIDE_DELAY);
  }
</script>

<dd class="grid grid-cols-[10%_50%_40%] pt-2">
  <div class="mr-1.5">
    {#if type === 'ethereum'}
      <EthereumLogo width="16px" height="16px" class="shrink-0" />
    {:else if type === 'solana'}
      <SolanaLogo width="16px" height="16px" class="shrink-0" />
    {/if}
  </div>
  <button
    class="cursor-pointer whitespace-nowrap rounded-full bg-gray-100 py-0.5"
    aria-roledescription={$_('sidebar.verify.credit.web3.copy')}
    on:click={() => handleClick(address)}>
    <Body>{truncatedAddress}</Body>
  </button>
  <div
    aria-live="assertive"
    aria-label={hidden ? '' : $_('sidebar.verify.credit.web3.copied')}
    class={[
      'pt-0.5 transition  duration-200 ease-in-out',
      hidden ? 'opacity-0' : 'opacity-100',
    ].join(' ')}>
    <SmallDescription
      >{$_('sidebar.verify.credit.web3.copied')}</SmallDescription>
  </div>
  <div class="col-start-2 pt-2 capitalize">
    <SmallDescription>{type}</SmallDescription>
  </div>
</dd>
