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
  import type { AssetData, ManifestData } from '$src/lib/asset';

  interface LocaleData {
    from: string;
    to: string;
  }

  type ContentSummary = {
    key:
      | 'contentSummary.compositeWithTrainedAlgorithmicMedia.other'
      | 'contentSummary.compositeWithTrainedAlgorithmicMedia.image'
      | 'contentSummary.compositeWithTrainedAlgorithmicMedia.audio'
      | 'contentSummary.compositeWithTrainedAlgorithmicMedia.video'
      | 'contentSummary.customModel.other'
      | 'contentSummary.customModel.image'
      | 'contentSummary.customModel.audio'
      | 'contentSummary.customModel.video'
      | 'contentSummary.trainedAlgorithmicMedia'
      | 'contentSummary.autoDub.dubbed'
      | 'contentSummary.autoDub.dubbedLipsRoi'
      | 'contentSummary.autoDub.dubbedLipsTranscriptRoi'
      | 'contentSummary.autoDub.transcriptRoi';
  };

  type ContentSummaryTranslated = {
    key:
      | 'contentSummary.autoDub.dubbedTranslated'
      | 'contentSummary.autoDub.dubbedTranslatedLipsRoi'
      | 'contentSummary.autoDub.dubbedTranslatedLipsTranscriptRoi'
      | 'contentSummary.autoDub.dubbedTranslatedTranscriptRoi';
    locale: LocaleData;
  };

  type ContentSummaryData = ContentSummary | ContentSummaryTranslated;

  export interface ContentSummarySectionProps {
    contentSummaryData: ContentSummaryData | null;
  }

  const getLocaleDataFromAutoDubInfo = (
    data: TranslatedActionDataParams,
  ): LocaleData => ({
    from: data.sourceLanguage,
    to: data.targetLanguage,
  });

  const suffixMediaType = (
    key: string,
    mimeType: string | null,
  ): ContentSummary['key'] => {
    const matches = mimeType && /^(image|audio|video)/.exec(mimeType);
    const mediaType = matches?.[1] ?? 'other';

    return `${key}.${mediaType}` as ContentSummary['key'];
  };

  export function assetDataToProps(
    assetData: Partial<AssetData>,
  ): ContentSummarySectionProps {
    const { mimeType, manifestData } = assetData;

    return manifestData
      ? getContentSummaryFromManifestData(manifestData, mimeType)
      : {
          contentSummaryData: null,
        };
  }

  export function getContentSummaryFromManifestData(
    { autoDubInfo, generativeInfo }: Partial<ManifestData>,
    mimeType: string | null = null,
  ): ContentSummarySectionProps {
    if (autoDubInfo) {
      const { hasLipsRoi, hasTranscriptRoi, translatedData } = autoDubInfo;

      if (hasLipsRoi && hasTranscriptRoi && translatedData) {
        return {
          contentSummaryData: {
            key: 'contentSummary.autoDub.dubbedTranslatedLipsTranscriptRoi',
            locale: getLocaleDataFromAutoDubInfo(translatedData),
          },
        };
      }

      if (hasLipsRoi && hasTranscriptRoi) {
        return {
          contentSummaryData: {
            key: 'contentSummary.autoDub.dubbedLipsTranscriptRoi',
          },
        };
      }

      if (hasLipsRoi && translatedData) {
        return {
          contentSummaryData: {
            key: 'contentSummary.autoDub.dubbedTranslatedLipsRoi',
            locale: getLocaleDataFromAutoDubInfo(translatedData),
          },
        };
      }

      if (hasTranscriptRoi && translatedData) {
        return {
          contentSummaryData: {
            key: 'contentSummary.autoDub.dubbedTranslatedTranscriptRoi',
            locale: getLocaleDataFromAutoDubInfo(translatedData),
          },
        };
      }

      if (hasLipsRoi) {
        return {
          contentSummaryData: {
            key: 'contentSummary.autoDub.dubbedLipsRoi',
          },
        };
      }

      if (hasTranscriptRoi) {
        return {
          contentSummaryData: {
            key: 'contentSummary.autoDub.transcriptRoi',
          },
        };
      }

      if (translatedData) {
        return {
          contentSummaryData: {
            key: 'contentSummary.autoDub.dubbedTranslated',
            locale: getLocaleDataFromAutoDubInfo(translatedData),
          },
        };
      }

      return {
        contentSummaryData: {
          key: 'contentSummary.autoDub.dubbed',
        },
      };
    }

    if (generativeInfo?.type) {
      if (generativeInfo?.customModels.length > 0) {
        return {
          contentSummaryData: {
            key: suffixMediaType('contentSummary.customModel', mimeType),
          },
        };
      }

      switch (generativeInfo?.type) {
        case 'compositeWithTrainedAlgorithmicMedia':
          return {
            contentSummaryData: {
              key: suffixMediaType(
                'contentSummary.compositeWithTrainedAlgorithmicMedia',
                mimeType,
              ),
            },
          };
        case 'legacy':
        case 'trainedAlgorithmicMedia':
          return {
            contentSummaryData: {
              key: suffixMediaType(
                'contentSummary.trainedAlgorithmicMedia',
                mimeType,
              ),
            },
          };
      }
    }

    return {
      contentSummaryData: null,
    };
  }
</script>

<script lang="ts">
  import info from '$assets/svg/monochrome/info-outline.svg';
  import Section from '$src/components/SidebarSection/Section.svelte';
  import BodyBold from '$src/components/typography/BodyBold.svelte';
  import Description from '$src/components/typography/Description.svelte';
  import type { TranslatedActionDataParams } from '$src/lib/selectors/autoDubInfo';
  import { has } from 'lodash';
  import { _, locale } from 'svelte-i18n';

  function hasLocaleData(
    data: ContentSummaryData,
  ): data is ContentSummaryTranslated {
    return has(data, 'locale');
  }

  function formatLocaleData(data: LocaleData): LocaleData {
    if (!$locale) {
      return {
        from: $_('contentSummary.autoDub.languageUnknown'),
        to: $_('contentSummary.autoDub.languageUnknown'),
      };
    }

    const displayNames = new Intl.DisplayNames([$locale], { type: 'language' });

    try {
      return {
        from:
          displayNames.of(data.from) ??
          $_('contentSummary.autoDub.languageUnknown'),
        to:
          displayNames.of(data.to) ??
          $_('contentSummary.autoDub.languageUnknown'),
      };
    } catch (err: unknown) {
      return {
        from: $_('contentSummary.autoDub.languageUnknown'),
        to: $_('contentSummary.autoDub.languageUnknown'),
      };
    }
  }

  export let contentSummaryData:
    | ContentSummarySectionProps['contentSummaryData']
    | null;
</script>

{#if contentSummaryData}
  <Section>
    <BodyBold slot="title">{$_('sidebar.verify.summary')}</BodyBold>
    <div class="flex" slot="content">
      <img src={info} alt="" class="self-start pe-2" />
      <Description
        >{hasLocaleData(contentSummaryData)
          ? $_(contentSummaryData.key, {
              values: { ...formatLocaleData(contentSummaryData.locale) },
            })
          : $_(contentSummaryData.key)}</Description>
    </div>
  </Section>
{/if}
