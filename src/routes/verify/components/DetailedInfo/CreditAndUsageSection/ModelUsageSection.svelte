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
  import ModelIcon from '$assets/svg/monochrome/ai-model.svg?component';
  import { _ } from 'svelte-i18n';
  import SubSection from '../../SubSection/SubSection.svelte';
  import AboutSectionIconContentRow from '../AboutSection/AboutSectionIconContentRow.svelte';
</script>

<SubSection
  ><svelte:fragment slot="title">
    {$_('sidebar.verify.credit.modelUsage.title')}
  </svelte:fragment>
  <AboutSectionIconContentRow slot="content">
    <ModelIcon class="h-4 w-4" />
    <div slot="content">{$_('sidebar.verify.credit.modelUsage.text')}</div>
  </AboutSectionIconContentRow>
</SubSection>
