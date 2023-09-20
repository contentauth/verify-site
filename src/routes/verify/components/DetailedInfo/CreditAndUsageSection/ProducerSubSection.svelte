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
  import producerIcon from '$assets/svg/color/logos/producer.svg';
  import { _ } from 'svelte-i18n';
  import SubSection from '../../SubSection/SubSection.svelte';
  import AboutSectionIconContentRow from '../AboutSection/AboutSectionIconContentRow.svelte';

  export let producer: string;
</script>

<SubSection
  ><svelte:fragment slot="title">
    {$_('sidebar.verify.credit.producer')}
  </svelte:fragment>
  <AboutSectionIconContentRow slot="content">
    <img slot="icon" src={producerIcon} alt="" class="w-4" />
    <div class="break-all" slot="content">{producer}</div>
  </AboutSectionIconContentRow>
</SubSection>
