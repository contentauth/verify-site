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
  import { providerInfoFromSocialId } from '$lib/providers';
  import ProviderIcon from '$src/components/ProviderIcon/ProviderIcon.svelte';
  import SocialMediaInfo from '$src/components/SocialMediaInfo/SocialMediaInfo.svelte';
  import type { ManifestData } from '$src/lib/asset';
  import { _ } from 'svelte-i18n';
  import SubSection from '../../SubSection/SubSection.svelte';
  import AboutSectionIconContentRow from '../AboutSection/AboutSectionIconContentRow.svelte';

  export let socialAccounts: NonNullable<ManifestData['socialAccounts']>;
</script>

<SubSection>
  <svelte:fragment slot="title">
    {$_('sidebar.verify.credit.social')}</svelte:fragment>
  <div class="flex flex-col gap-2.5" slot="content">
    {#each socialAccounts as account (account['@id'])}
      <AboutSectionIconContentRow>
        <div slot="icon">
          <ProviderIcon provider={account['@id'] ?? ''} />
        </div>
        <SocialMediaInfo
          slot="content"
          link={account['@id'] ?? ''}
          username={account['name']}
          appName={providerInfoFromSocialId(account['@id'] ?? '')?.name ??
            ''} />
      </AboutSectionIconContentRow>
    {/each}
  </div>
</SubSection>
