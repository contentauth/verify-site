// ADOBE CONFIDENTIAL
// Copyright 2024 Adobe
// All Rights Reserved.
//
// NOTICE: All information contained herein is, and remains
// the property of Adobe and its suppliers, if any. The intellectual
// and technical concepts contained herein are proprietary to Adobe
// and its suppliers and are protected by all applicable intellectual
// property laws, including trade secret and copyright laws.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe.

import { describe, expect, it } from 'vitest';
import { getContentSummaryFromManifestData } from './ContentSummarySection.svelte';

describe('components/SidebarMenu', () => {
  describe('getContentSummaryFromManifestData', () => {
    it('returns the correct data with no ROI or translation data', () => {
      const data = getContentSummaryFromManifestData({
        autoDubInfo: {
          hasLipsRoi: false,
          hasTranscriptRoi: false,
          translatedData: null,
        },
      });

      expect(data).toEqual({
        contentSummaryData: {
          key: 'contentSummary.autoDub.dubbed',
        },
      });
    });

    it('returns the correct data with translation data and no ROI', () => {
      const data = getContentSummaryFromManifestData({
        autoDubInfo: {
          hasLipsRoi: false,
          hasTranscriptRoi: false,
          translatedData: {
            sourceLanguage: 'en',
            targetLanguage: 'fr',
          },
        },
      });

      expect(data).toEqual({
        contentSummaryData: {
          key: 'contentSummary.autoDub.dubbedTranslated',
          locale: {
            from: 'en',
            to: 'fr',
          },
        },
      });
    });

    it('returns the correct data with translation data, lips ROI, and transcript ROI', () => {
      const data = getContentSummaryFromManifestData({
        autoDubInfo: {
          hasLipsRoi: true,
          hasTranscriptRoi: true,
          translatedData: {
            sourceLanguage: 'en',
            targetLanguage: 'fr',
          },
        },
      });

      expect(data).toEqual({
        contentSummaryData: {
          key: 'contentSummary.autoDub.dubbedTranslatedLipsTranscriptRoi',
          locale: {
            from: 'en',
            to: 'fr',
          },
        },
      });
    });

    it('returns the correct data with translation data, transcript ROI, and no lips ROI', () => {
      const data = getContentSummaryFromManifestData({
        autoDubInfo: {
          hasLipsRoi: false,
          hasTranscriptRoi: true,
          translatedData: {
            sourceLanguage: 'en',
            targetLanguage: 'fr',
          },
        },
      });

      expect(data).toEqual({
        contentSummaryData: {
          key: 'contentSummary.autoDub.dubbedTranslatedTranscriptRoi',
          locale: {
            from: 'en',
            to: 'fr',
          },
        },
      });
    });

    it('returns the correct data with lips ROI and no translation data', () => {
      const data = getContentSummaryFromManifestData({
        autoDubInfo: {
          hasLipsRoi: true,
          hasTranscriptRoi: false,
          translatedData: null,
        },
      });

      expect(data).toEqual({
        contentSummaryData: {
          key: 'contentSummary.autoDub.dubbedLipsRoi',
        },
      });
    });

    it('returns the correct data with lips ROI, transcript ROI, and no translation data', () => {
      const data = getContentSummaryFromManifestData({
        autoDubInfo: {
          hasLipsRoi: true,
          hasTranscriptRoi: true,
          translatedData: null,
        },
      });

      expect(data).toEqual({
        contentSummaryData: {
          key: 'contentSummary.autoDub.dubbedLipsTranscriptRoi',
        },
      });
    });

    it('returns the correct data with transcript ROI and no translation data', () => {
      const data = getContentSummaryFromManifestData({
        autoDubInfo: {
          hasLipsRoi: false,
          hasTranscriptRoi: true,
          translatedData: null,
        },
      });

      expect(data).toEqual({
        contentSummaryData: {
          key: 'contentSummary.autoDub.transcriptRoi',
        },
      });
    });

    it('returns the correct data with compositeWithTrainedAlgorithmicMedia generative info', () => {
      const data = getContentSummaryFromManifestData({
        generativeInfo: {
          softwareAgents: [{ name: 'test', version: '1.0' }],
          type: 'compositeWithTrainedAlgorithmicMedia',
        },
      });

      expect(data).toEqual({
        contentSummaryData: {
          key: 'contentSummary.compositeWithTrainedAlgorithmicMedia',
        },
      });
    });

    it('returns the correct data with legacy generative info', () => {
      const data = getContentSummaryFromManifestData({
        generativeInfo: {
          softwareAgents: [{ name: 'test', version: '1.0' }],
          type: 'legacy',
        },
      });

      expect(data).toEqual({
        contentSummaryData: {
          key: 'contentSummary.trainedAlgorithmicMedia',
        },
      });
    });

    it('returns the correct data with trainedAlgorithmicMedia generative info', () => {
      const data = getContentSummaryFromManifestData({
        generativeInfo: {
          softwareAgents: [{ name: 'test', version: '1.0' }],
          type: 'trainedAlgorithmicMedia',
        },
      });

      expect(data).toEqual({
        contentSummaryData: {
          key: 'contentSummary.trainedAlgorithmicMedia',
        },
      });
    });
  });
});
