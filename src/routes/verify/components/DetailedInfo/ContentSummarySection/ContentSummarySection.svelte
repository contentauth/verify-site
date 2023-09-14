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
<script lang="ts" context="module">
  import type { AssetData } from '$src/lib/asset';

  export interface ContentSummarySectionProps {
    contentSummaryKey:
      | 'contentSummary.compositeWithTrainedAlgorithmicMedia'
      | 'contentSummary.trainedAlgorithmicMedia'
      | null;
  }

  export function assetDataToProps(
    assetData: Partial<AssetData>,
  ): ContentSummarySectionProps {
    switch (assetData.manifestData?.generativeInfo?.type) {
      case 'compositeWithTrainedAlgorithmicMedia':
        return {
          contentSummaryKey:
            'contentSummary.compositeWithTrainedAlgorithmicMedia',
        };
      case 'legacy':
      case 'trainedAlgorithmicMedia':
        return {
          contentSummaryKey: 'contentSummary.trainedAlgorithmicMedia',
        };
      default:
        return {
          contentSummaryKey: null,
        };
    }
  }
</script>

<script lang="ts">
  import info from '$assets/svg/monochrome/info-outline.svg';
  import Section from '$src/components/SidebarSection/Section.svelte';
  import BodyBold from '$src/components/typography/BodyBold.svelte';
  import Description from '$src/components/typography/Description.svelte';
  import { _ } from 'svelte-i18n';

  export let contentSummaryKey: ContentSummarySectionProps['contentSummaryKey'];
</script>

{#if contentSummaryKey}
  <Section>
    <BodyBold slot="title">{$_('sidebar.verify.summary')}</BodyBold>
    <div class="flex" slot="content">
      <img src={info} alt="" class="self-start pe-2" />
      <Description>{$_(contentSummaryKey)}</Description>
    </div>
  </Section>
{/if}
