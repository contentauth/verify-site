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
  import ProviderIcon from '$src/components/ProviderIcon/ProviderIcon.svelte';
  import { _ } from 'svelte-i18n';
  import SubSection from '../../../components/SubSection/SubSection.svelte';
  import AboutSectionIconContentRow from '../AboutSection/AboutSectionIconContentRow.svelte';

  export let generator: string;
  export let isUntrusted: boolean;
</script>

<SubSection>
  <svelte:fragment slot="title">
    {$_('sidebar.verify.process.app')}</svelte:fragment>
  <AboutSectionIconContentRow slot="content">
    <svelte:fragment slot="icon">
      {#if !isUntrusted}
        <ProviderIcon provider={generator} />
      {/if}
    </svelte:fragment>
    <div slot="content" class="break-all">{generator}</div>
  </AboutSectionIconContentRow>
</SubSection>
