// ADOBE CONFIDENTIAL
// Copyright 2023 Adobe
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

import { C2paTestImageServiceConfig } from 'c2pa-test-image-service';

const port = parseInt(
  (process.env.TEST_IMAGE_SERVICE_PORT as string | undefined) ?? '8082',
  10,
);

export default {
  port,
  fixtures: {
    default: {
      image: { r: 0, g: 0, b: 255, width: 600, height: 600 },
      manifest: {
        title: 'test-image.jpg',
        claim_generator: 'test-image-service',
        format: 'image/jpeg',
      },
    },
    exif: {
      image: { r: 60, g: 245, b: 84, width: 600, height: 600 },
      manifest: {
        title: 'exif-image.jpg',
        claim_generator: 'test-image-service',
        format: 'image/jpeg',
        assertions: [
          {
            label: 'stds.exif',
            data: {
              '@context': {
                dc: 'http://purl.org/dc/elements/1.1/',
                exif: 'http://ns.adobe.com/exif/1.0/',
                exifEX: 'http://cipa.jp/exif/2.32/',
                rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
                tiff: 'http://ns.adobe.com/tiff/1.0/',
                xmp: 'http://ns.adobe.com/xap/1.0/',
              },
              'dc:creator': 'Taro NIKON',
              'dc:rights': 'NIKON CORPORATION',
              'exif:ColorSpace': 1,
              'exif:ComponentsConfiguration': 'YCbCr_',
              'exif:CompressedBitsPerPixel': 1,
              'exif:Contrast': 0,
              'exif:CustomRendered': 1,
              'exif:DateTimeOriginal': '2022-10-13T07:41:24,48+09:00',
              'exif:ExifVersion': 2.32,
              'exif:ExposureBiasValue': 0,
              'exif:ExposureMode': 0,
              'exif:ExposureProgram': 3,
              'exif:ExposureTime': '1/80',
              'exif:FNumber': '4',
              'exif:FileSource': 'digital still camera',
              'exif:Flash': 0,
              'exif:FlashpixVersion': '1.0',
              'exif:FocalLength': 70,
              'exif:FocalLengthIn35mmFilm': 70,
              'exif:GPSLatitude': '40,43.0987N',
              'exif:GPSLongitude': '74,0.8683W',
              'exif:GPSTimeStamp': '2022-10-12T22:41:23Z',
              'exif:GPSVersionID': '2.3.0.0',
              'exif:GainControl': 2,
              'exif:LightSource': 'unknown',
              'exif:MeteringMode': 5,
              'exif:PixelXDimension': 4128,
              'exif:PixelYDimension': 2752,
              'exif:Saturation': 0,
              'exif:SceneCaptureType': 0,
              'exif:SceneType': 'directly photographed image',
              'exif:SensingMethod': 2,
              'exif:Sharpness': 0,
              'exif:SubjectDistanceRange': 0,
              'exif:WhiteBalance': 0,
              'exifEX:BodySerialNumber': '0030079',
              'exifEX:CompositeImage': 1,
              'exifEX:InteroperabilityIndex': 'R98',
              'exifEX:LensMake': 'NIKON',
              'exifEX:LensModel': 'NIKKOR Z 24-70mm f/4 S',
              'exifEX:LensSerialNumber': '20048824  ',
              'exifEX:LensSpecification': ['24-70 mm', 'f/4-4'],
              'exifEX:PhotographicSensitivity': 9000,
              'exifEX:RecommendedExposureIndex': 9000,
              'exifEX:SensitivityType': 2,
              'tiff:Make': 'NIKON CORPORATION',
              'tiff:Model': 'NIKON Z 9',
              'tiff:Orientation': 1,
              'tiff:ResolutionUnit': 2,
              'tiff:XResolution': 300,
              'tiff:YCbCrPositioning': 2,
              'tiff:YResolution': 300,
              'xmp:CreateDate': '2022-10-13T07:41:24,48+09:00',
              'xmp:CreatorTool': 'Ver.T2.10.gb',
              'xmp:ModifyDate': '2022-10-13T07:41:24,48+09:00',
            },
          },
        ],
      },
    },
    missingThumbnails: {
      image: { r: 10, g: 10, b: 240, width: 300, height: 600 },
      manifest: {
        claim_generator: 'test-image-service',
        title: 'missing-thumbnails.jpg',
        format: 'image/jpeg',
        instance_id: 'xmp:iid:ddb36a5e-d59a-4cc9-a6dd-057ba8da4e0e',
        ingredients: [
          {
            title: 'image.jpg',
            format: 'image/jpeg',
            document_id: 'xmp.did:813ee422-9736-4cdc-9be6-4e35ed8e41cb',
            instance_id: 'xmp.iid:813ee422-9736-4cdc-9be6-4e35ed8e41cb',
            relationship: 'parentOf',
          },
          {
            title: 'audio.m4a',
            format: 'audio/mp4',
            document_id: 'xmp.did:8a00de7a-e694-43b2-a7e6-ed950421a21a',
            instance_id: 'xmp.iid:8a00de7a-e694-43b2-a7e6-ed950421a21a',
            relationship: 'componentOf',
          },
          {
            title: 'video.mp4',
            format: 'video/mp4',
            document_id: 'xmp.did:8a00de7a-e694-43b2-a7e6-ed950421a21a',
            instance_id: 'xmp.iid:8a00de7a-e694-43b2-a7e6-ed950421a21a',
            relationship: 'componentOf',
          },
          {
            title: 'unknown.bin',
            format: 'application/octet-stream',
            document_id: 'xmp.did:8a00de7a-e694-43b2-a7e6-ed950421a21a',
            instance_id: 'xmp.iid:8a00de7a-e694-43b2-a7e6-ed950421a21a',
            relationship: 'componentOf',
          },
        ],
      },
    },
    dnt: {
      image: { r: 154, g: 63, b: 7, width: 600, height: 300 },
      manifest: {
        claim_generator: 'test-image-service',
        title: 'dnt.jpg',
        format: 'image/jpeg',
        instance_id: 'xmp:iid:ddb36a5e-d59a-4cc9-a6dd-057ba8da4e0e',
        assertions: [
          {
            label: 'c2pa.training-mining',
            data: {
              entries: {
                'c2pa.ai_generative_training': { use: 'notAllowed' },
                'c2pa.ai_inference': { use: 'notAllowed' },
                'c2pa.ai_training': { use: 'notAllowed' },
                'c2pa.data_mining': { use: 'notAllowed' },
              },
            },
          },
        ],
      },
    },
    inference: {
      image: { r: 20, g: 219, b: 56, width: 500, height: 300 },
      manifest: {
        claim_generator: 'Adobe_Firefly c2pa-adobe-js/0.16.0 c2pa-rs/0.25.1',
        title: 'Generated image',
        format: 'image/jpeg',
        instance_id: 'xmp:iid:61f7ffbf-2fdc-4c3f-9e5c-4a6591ac809c',
        assertions: [
          {
            label: 'c2pa.actions',
            data: {
              actions: [
                {
                  action: 'c2pa.created',
                  digitalSourceType:
                    'https://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia',
                  softwareAgent: 'Adobe Firefly',
                },
              ],
              metadata: {
                'com.adobe.inference': true,
              },
            },
          },
        ],
      },
    },
    'no-inference': {
      image: { r: 218, g: 21, b: 56, width: 500, height: 300 },
      manifest: {
        claim_generator: 'Adobe_Firefly c2pa-adobe-js/0.16.0 c2pa-rs/0.25.1',
        title: 'Generated image',
        format: 'image/jpeg',
        instance_id: 'xmp:iid:61f7ffbf-2fdc-4c3f-9e5c-4a6591ac809c',
        assertions: [
          {
            label: 'c2pa.actions',
            data: {
              actions: [
                {
                  action: 'c2pa.created',
                  digitalSourceType:
                    'https://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia',
                  softwareAgent: 'Adobe Firefly',
                },
              ],
            },
          },
        ],
      },
    },
    'review-ratings': {
      image: { r: 218, g: 218, b: 12, width: 500, height: 300 },
      manifest: {
        title: 'review-ratings.jpg',
        claim_generator: 'test-image-service',
        format: 'image/jpeg',
        instance_id: 'xmp:iid:61f7ffbf-2fdc-4c3f-9e5c-4a6591ac809c',
        assertions: [
          {
            label: 'c2pa.actions',
            data: {
              actions: [
                {
                  action: 'c2pa.created',
                  digitalSourceType:
                    'https://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia',
                  softwareAgent: 'Adobe Firefly',
                },
              ],
              metadata: {
                reviewRatings: [
                  {
                    code: 'com.adobe.enabledCAI',
                    explanation: 'Photoshop specific review',
                    value: 5,
                  },
                  {
                    code: 'actions.unknownActionsPerformed',
                    explanation: 'CAI was enabled while editing',
                    value: 4,
                  },
                ],
              },
            },
          },
        ],
      },
    },
    'adobe-stock': {
      image: { r: 98, g: 98, b: 98, width: 500, height: 300 },
      manifest: {
        title: 'adobe-stock.jpg',
        claim_generator: 'Adobe_Stock adobe_c2pa/0.7.7 c2pa-rs/0.25.2',
        format: 'image/jpeg',
        assertions: [
          {
            label: 'stds.schema-org.CreativeWork',
            data: {
              '@context': 'https://schema.org',
              '@type': 'CreativeWork',
              url: 'https://stock.adobe.com/647059723',
            },
          },
          {
            label: 'adobe.dictionary',
            data: {
              url: 'https://cai-assertions.adobe.com/stock/dictionary.json',
            },
          },
          {
            label: 'c2pa.actions',
            data: {
              actions: [
                {
                  action: 'adobe.delivered',
                },
              ],
            },
          },
        ],
      },
    },
    xss: {
      image: { r: 18, g: 100, b: 18, width: 500, height: 300 },
      manifest: {
        title: 'xss.jpg',
        claim_generator: 'test-image-service',
        format: 'image/jpeg',
        assertions: [
          {
            label: 'stds.schema-org.CreativeWork',
            data: {
              '@context': 'https://schema.org',
              '@type': 'CreativeWork',
              url: 'http://insecure.com',
              author: [
                {
                  '@id': 'javascript:alert(1)',
                  '@type': 'Person',
                  identifier:
                    'did:adobe:f50f50a1f6cc5ef5b5cb51a5c457fb4537b274351e40cf1d2bdf5d3f45b1d9d69',
                  name: 'XSS',
                },
              ],
            },
          },
        ],
      },
    },
    'kitchen-sink': {
      image: { r: 6, g: 214, b: 78, width: 500, height: 300 },
      manifest: {
        title: 'test-image.jpg',
        claim_generator: 'test-image-service',
        format: 'image/jpeg',
        assertions: [
          {
            label: 'adobe.crypto.addresses',
            data: {
              ethereum: ['0x12558883cd468e515145db5e7a412d63b763949d'],
              solana: ['0x12558883cd468e515145db5e7a412d63b763949d'],
            },
          },
          {
            label: 'stds.schema-org.CreativeWork',
            data: {
              '@context': 'https://schema.org',
              '@type': 'CreativeWork',
              author: [
                {
                  '@type': 'Person',
                  credential: [
                    {
                      alg: 'sha256',
                      hash: [
                        86, 41, 219, 71, 195, 159, 32, 172, 102, 204, 254, 144,
                        21, 63, 103, 49, 64, 251, 79, 80, 207, 131, 12, 79, 164,
                        204, 93, 39, 194, 227, 5, 201,
                      ],
                      url: 'self#jumbf=/c2pa/adobe:urn:uuid:c5a3bba2-634f-4ff5-959b-680c586994d2/c2pa.credentials/did:adobe:f50f50a1f6cc5ef5b5cb51a5c457fb4537b274351e40cf1d2bdf5d3f45b1d9d69',
                    },
                  ],
                  identifier:
                    'did:adobe:f50f50a1f6cc5ef5b5cb51a5c457fb4537b274351e40cf1d2bdf5d3f45b1d9d69',
                  name: 'Foo Bar',
                },
                {
                  '@id': 'https://www.behance.net/foobar',
                  '@type': 'Person',
                  identifier:
                    'did:adobe:f50f50a1f6cc5ef5b5cb51a5c457fb4537b274351e40cf1d2bdf5d3f45b1d9d69',
                  name: 'Foo Bar1234567890123456789012345678901234567890',
                },
                {
                  '@id': 'https://www.instagram.com/foobar',
                  '@type': 'Person',
                  identifier:
                    'did:adobe:f50f50a1f6cc5ef5b5cb51a5c457fb4537b274351e40cf1d2bdf5d3f45b1d9d69',
                  name: 'foobarbaz',
                },
                {
                  '@id': 'https://www.linkedin.com/in/foobar',
                  '@type': 'Person',
                  identifier:
                    'did:adobe:f50f50a1f6cc5ef5b5cb51a5c457fb4537b274351e40cf1d2bdf5d3f45b1d9d69',
                  name: 'Foo Bar',
                },
                {
                  '@id': 'https://www.someunknownprovider.com',
                  '@type': 'Person',
                  identifier:
                    'did:adobe:f50f50a1f6cc5ef5b5cb51a5c457fb4537b274351e40cf1d2bdf5d3f45b1d9d69',
                  name: 'Unknown Provider',
                },
              ],
            },
          },
        ],
      },
    },
    'legacy-trained-algorithmic-media': {
      image: { r: 173, g: 148, b: 10, width: 500, height: 300 },
      manifest: {
        title: 'test-image.jpg',
        claim_generator: 'test-image-service',
        format: 'image/jpeg',
        assertions: [
          {
            label: 'com.adobe.generative-ai',
            data: {
              description: 'Some AI tool',
              version: '1.0.0',
            },
          },
        ],
      },
    },
    'v1-actions-trained-algorithmic-media': {
      image: { r: 173, g: 148, b: 10, width: 500, height: 300 },
      manifest: {
        title: 'test-image.jpg',
        claim_generator: 'test-image-service',
        format: 'image/jpeg',
        assertions: [
          {
            label: 'c2pa.actions',
            data: {
              actions: [
                {
                  action: 'c2pa.placed',
                  digitalSourceType:
                    'http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia',
                  parameters: {
                    'com.adobe.icon':
                      'https://cai-assertions.adobe.com/icons/save-to-light-dark.svg',
                    'com.adobe.tool': 'generative_fill',
                    description: 'Added pre-existing content to this file',
                    instanceId: 'xmp:iid:23c849a4-6d5c-47ef-895c-09f37274953a',
                  },
                  softwareAgent: 'Adobe Firefly',
                },
              ],
            },
          },
        ],
      },
    },
    'v1-actions-composite-algorithmic-media': {
      image: { r: 173, g: 148, b: 10, width: 500, height: 300 },
      manifest: {
        title: 'test-image.jpg',
        claim_generator: 'test-image-service',
        format: 'image/jpeg',
        assertions: [
          {
            label: 'c2pa.actions',
            data: {
              actions: [
                {
                  action: 'c2pa.edited',
                  digitalSourceType:
                    'https://cv.iptc.org/newscodes/digitalsourcetype/compositeWithTrainedAlgorithmicMedia',
                  softwareAgent: 'Adobe Firefly',
                },
              ],
            },
          },
        ],
      },
    },
    'claim-generator-info': {
      image: { r: 0, g: 0, b: 255, width: 600, height: 600 },
      manifest: {
        title: 'Claim Generator Image.jpg',
        claim_generator: 'Claim Generator V1',
        claim_generator_info: [
          {
            name: 'Claim Generator',
            version: 'v2',
          },
        ],
        format: 'image/jpeg',
      },
    },
  },
} satisfies C2paTestImageServiceConfig;
