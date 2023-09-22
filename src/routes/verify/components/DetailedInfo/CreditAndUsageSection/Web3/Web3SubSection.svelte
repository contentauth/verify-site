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
  import { _ } from 'svelte-i18n';
  import SubSection from '../../../SubSection/SubSection.svelte';
  import Web3Pill from './Web3Pill.svelte';

  export let web3Accounts: [string, string[]][];
</script>

<SubSection
  ><svelte:fragment slot="title">
    {$_('sidebar.verify.credit.web3')}
  </svelte:fragment>
  <svelte:fragment slot="content">
    {#each web3Accounts as [type, [address]]}
      <div class="pb-1">
        <Web3Pill {type} {address} />
      </div>
    {/each}
  </svelte:fragment>
</SubSection>
