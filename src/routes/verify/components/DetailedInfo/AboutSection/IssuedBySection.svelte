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
  import help from '$assets/svg/monochrome/help.svg';
  import ProviderIcon from '$src/components/ProviderIcon/ProviderIcon.svelte';
  import { _ } from 'svelte-i18n';
  import SubSection from '../../../components/SubSection/SubSection.svelte';
  import Tooltip from '../../Tooltip/Tooltip.svelte';
  import AboutSectionIconContentRow from './AboutSectionIconContentRow.svelte';

  let showTooltip = false;
  export let isUntrusted: boolean;
  export let issuedBy: string;
</script>

<SubSection>
  <svelte:fragment slot="title">
    {$_('sidebar.verify.about.issuedby')}</svelte:fragment>
  <div slot="content">
    <div class="flex justify-between">
      <AboutSectionIconContentRow>
        <svelte:fragment slot="icon">
          {#if !isUntrusted}
            <ProviderIcon provider={issuedBy} />
          {/if}
        </svelte:fragment>
        <svelte:fragment slot="content">
          {issuedBy}
        </svelte:fragment>
      </AboutSectionIconContentRow>
      <button on:click={() => (showTooltip = !showTooltip)}
        ><img
          src={help}
          alt={$_('sidebar.verify.search.tooltip.help')} /></button>
    </div>
    {#if showTooltip}
      <Tooltip showTooltip on:showToolip={() => (showTooltip = !showTooltip)}
        ><div slot="tooltip">
          {$_('sidebar.verify.about.issuedby.tooltip')}
        </div>
      </Tooltip>
    {/if}
  </div>
</SubSection>
