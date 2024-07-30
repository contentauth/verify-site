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

    it('returns the correct data with compositeWithTrainedAlgorithmicMedia generative info for images', () => {
      const data = getContentSummaryFromManifestData(
        {
          generativeInfo: {
            softwareAgents: [{ name: 'test', version: '1.0' }],
            type: 'compositeWithTrainedAlgorithmicMedia',
            customModels: [],
          },
        },
        'image/jpeg',
      );

      expect(data).toEqual({
        contentSummaryData: {
          key: 'contentSummary.compositeWithTrainedAlgorithmicMedia.image',
        },
      });
    });

    it('returns the correct data with compositeWithTrainedAlgorithmicMedia generative info for video', () => {
      const data = getContentSummaryFromManifestData(
        {
          generativeInfo: {
            softwareAgents: [{ name: 'test', version: '1.0' }],
            type: 'compositeWithTrainedAlgorithmicMedia',
            customModels: [],
          },
        },
        'video/mp4',
      );

      expect(data).toEqual({
        contentSummaryData: {
          key: 'contentSummary.compositeWithTrainedAlgorithmicMedia.video',
        },
      });
    });

    it('returns the correct data with compositeWithTrainedAlgorithmicMedia generative info for audio', () => {
      const data = getContentSummaryFromManifestData(
        {
          generativeInfo: {
            softwareAgents: [{ name: 'test', version: '1.0' }],
            type: 'compositeWithTrainedAlgorithmicMedia',
            customModels: [],
          },
        },
        'audio/wav',
      );

      expect(data).toEqual({
        contentSummaryData: {
          key: 'contentSummary.compositeWithTrainedAlgorithmicMedia.audio',
        },
      });
    });

    it('returns the correct data with compositeWithTrainedAlgorithmicMedia generative info for unknown data', () => {
      const data1 = getContentSummaryFromManifestData({
        generativeInfo: {
          softwareAgents: [{ name: 'test', version: '1.0' }],
          type: 'compositeWithTrainedAlgorithmicMedia',
          customModels: [],
        },
      });

      expect(data1).toEqual({
        contentSummaryData: {
          key: 'contentSummary.compositeWithTrainedAlgorithmicMedia.other',
        },
      });

      const data2 = getContentSummaryFromManifestData(
        {
          generativeInfo: {
            softwareAgents: [{ name: 'test', version: '1.0' }],
            type: 'compositeWithTrainedAlgorithmicMedia',
            customModels: [],
          },
        },
        'application/octet-stream',
      );

      expect(data2).toEqual({
        contentSummaryData: {
          key: 'contentSummary.compositeWithTrainedAlgorithmicMedia.other',
        },
      });
    });

    it('returns the correct data with legacy generative info', () => {
      const data = getContentSummaryFromManifestData(
        {
          generativeInfo: {
            softwareAgents: [{ name: 'test', version: '1.0' }],
            type: 'legacy',
            customModels: [],
          },
        },
        'image/jpeg',
      );

      expect(data).toEqual({
        contentSummaryData: {
          key: 'contentSummary.trainedAlgorithmicMedia.image',
        },
      });
    });

    it('returns the correct data with trainedAlgorithmicMedia generative info for images', () => {
      const data = getContentSummaryFromManifestData(
        {
          generativeInfo: {
            softwareAgents: [{ name: 'test', version: '1.0' }],
            type: 'trainedAlgorithmicMedia',
            customModels: [],
          },
        },
        'image/png',
      );

      expect(data).toEqual({
        contentSummaryData: {
          key: 'contentSummary.trainedAlgorithmicMedia.image',
        },
      });
    });

    it('returns the correct data with trainedAlgorithmicMedia generative info for video', () => {
      const data = getContentSummaryFromManifestData(
        {
          generativeInfo: {
            softwareAgents: [{ name: 'test', version: '1.0' }],
            type: 'trainedAlgorithmicMedia',
            customModels: [],
          },
        },
        'video/quicktime',
      );

      expect(data).toEqual({
        contentSummaryData: {
          key: 'contentSummary.trainedAlgorithmicMedia.video',
        },
      });
    });

    it('returns the correct data with trainedAlgorithmicMedia generative info for audio', () => {
      const data = getContentSummaryFromManifestData(
        {
          generativeInfo: {
            softwareAgents: [{ name: 'test', version: '1.0' }],
            type: 'trainedAlgorithmicMedia',
            customModels: [],
          },
        },
        'audio/mp4',
      );

      expect(data).toEqual({
        contentSummaryData: {
          key: 'contentSummary.trainedAlgorithmicMedia.audio',
        },
      });
    });

    it('returns the correct data with trainedAlgorithmicMedia generative info for unknown data', () => {
      const data1 = getContentSummaryFromManifestData({
        generativeInfo: {
          softwareAgents: [{ name: 'test', version: '1.0' }],
          type: 'trainedAlgorithmicMedia',
          customModels: [],
        },
      });

      expect(data1).toEqual({
        contentSummaryData: {
          key: 'contentSummary.trainedAlgorithmicMedia.other',
        },
      });

      const data2 = getContentSummaryFromManifestData(
        {
          generativeInfo: {
            softwareAgents: [{ name: 'test', version: '1.0' }],
            type: 'trainedAlgorithmicMedia',
            customModels: [],
          },
        },
        'application/octet-stream',
      );

      expect(data2).toEqual({
        contentSummaryData: {
          key: 'contentSummary.trainedAlgorithmicMedia.other',
        },
      });
    });
  });
});
