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

export default {
  port: 8081,
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
  },
} satisfies C2paTestImageServiceConfig;
