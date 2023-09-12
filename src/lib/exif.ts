// ADOBE CONFIDENTIAL
// Copyright 2022 Adobe
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

import mapbox from '@mapbox/mapbox-sdk/lib/classes/mapi-client';
import mapboxStatic from '@mapbox/mapbox-sdk/services/static';
import type { Manifest } from 'c2pa';
import circleToPolygon from 'circle-to-polygon';
import parseISO from 'date-fns/parseISO';
import debug from 'debug';
import { convert as convertGeo } from 'geo-coordinates-parser';
import { mapKeys, merge } from 'lodash';

const dbg = debug('exif');

// See precision values here: https://en.wikipedia.org/wiki/Decimal_degrees
export const LOCATION_PRECISION = 2;

export interface ExifTags {
  'dc:creator'?: string;
  'dc:rights'?: string;
  'exif:datetimeoriginal'?: string;
  'exif:exposuretime'?: string | number;
  'exif:fnumber'?: number;
  'exif:gpslatitude'?: string;
  'exif:gpslongitude'?: string;
}

declare module 'c2pa' {
  interface ExtendedAssertions {
    'stds.exif': ExifTags;
  }
}

const exifTagRegExp = /^(exif(ex)?|dc|tiff|xmp):/i;

function findExifValue(exif: ExifTags, locations: string[]) {
  const value =
    locations
      .map((key) => exif[key as keyof ExifTags])
      .filter((x) => !!x)?.[0] ?? null;

  if (typeof value === 'string') {
    return value;
  } else if (Object.getPrototypeOf(value) == Object.prototype) {
    return value?.['$serde_json::private::Number'];
  }
}

interface CaptureDetails {
  cameraMake?: string;
  cameraModel?: string;
  lensMake?: string;
  lensModel?: string;
  exposureTime?: string;
  fNumber?: string;
  iso?: string;
}

function getCaptureDetails(exif: ExifTags) {
  const mapping: {
    label: keyof CaptureDetails;
    value: ReturnType<typeof findExifValue>;
  }[] = [
    {
      label: 'cameraMake',
      value: findExifValue(exif, ['exif:make', 'tiff:make']),
    },
    {
      label: 'cameraModel',
      value: findExifValue(exif, ['exif:model', 'tiff:model']),
    },
    {
      label: 'lensMake',
      value: findExifValue(exif, ['exif:lensmake', 'exifex:lensmake']),
    },
    {
      label: 'lensModel',
      value: findExifValue(exif, ['exif:lensmodel', 'exifex:lensmodel']),
    },
    {
      label: 'exposureTime',
      // TODO: Convert this to a fraction if not
      value: findExifValue(exif, ['exif:exposuretime']),
    },
    {
      label: 'fNumber',
      value: findExifValue(exif, ['exif:fnumber']),
    },
    {
      label: 'iso',
      value: findExifValue(exif, [
        'exifex:photographicsensitivity',
        'exif:isospeed',
        'exif:isospeedratings',
      ]),
    },
  ];

  return mapping
    .filter(({ value }) => !!value)
    .reduce((acc, { label, value }) => {
      return {
        ...acc,
        [label]: value,
      };
    }, {}) as CaptureDetails;
}

interface ApproximateLocation {
  long: number;
  lat: number;
}

function getApproximateLocation(exif: ExifTags): ApproximateLocation | null {
  const long = exif['exif:gpslongitude'];
  const lat = exif['exif:gpslatitude'];

  if (lat && long) {
    try {
      const approx = convertGeo([lat, long].join(' '), LOCATION_PRECISION);
      dbg('Got approximate location', approx);

      return {
        long: approx.decimalLongitude,
        lat: approx.decimalLatitude,
      };
    } catch (err) {
      dbg('Could not decode location', { lat, long, err });

      return null;
    }
  }

  return null;
}

export function selectExif(manifest: Manifest): ExifSummary | null {
  const exif: ExifTags = manifest.assertions
    .get('stds.exif')
    ?.reduce((acc, exif) => {
      const caseInsensitiveData = mapKeys(exif?.data, (_, key) => {
        return exifTagRegExp.test(key) ? key.toLowerCase() : key;
      });

      return merge({}, acc, caseInsensitiveData);
    }, {});

  dbg('Got EXIF tags', exif);

  if (Object.keys(exif).length > 0) {
    const captureDate = exif['exif:datetimeoriginal'];

    const summary: Omit<ExifSummary, 'mapUrl'> = {
      creator: exif['dc:creator'] ?? null,
      copyright: exif['dc:rights'] ?? null,
      captureDate: captureDate ? parseISO(captureDate) : null,
      captureDetails: getCaptureDetails(exif),
      location: getApproximateLocation(exif),
    };

    return {
      ...summary,
      mapUrl: generateMapUrl(summary),
    };
  }

  return null;
}

export type ExifSummary = {
  creator: string | null;
  copyright: string | null;
  captureDate: Date | null;
  captureDetails: ReturnType<typeof getCaptureDetails>;
  location: ReturnType<typeof getApproximateLocation>;
  mapUrl: string | null;
};

const defaultMapConfig = {
  ownerId: 'mapbox',
  styleId: 'light-v10',
  width: 271,
  height: 280,
  zoom: 9,
  highRes: true,
  highlightRadiusMeters: 10000,
  highlightEdges: 64,
  path: {
    strokeWidth: 3,
    strokeColor: '2680EB',
    fillColor: '2680EB',
    fillOpacity: 0.05,
  },
};

export function generateMapUrl(
  exif: Omit<ExifSummary, 'mapUrl'>,
  overrides: Partial<typeof defaultMapConfig> = {},
) {
  if (!exif.location) {
    return null;
  }

  const loc = exif.location;
  const config = { ...defaultMapConfig, ...overrides };
  const position = {
    coordinates: [loc.long, loc.lat] as [number, number],
    zoom: config.zoom,
  };

  // GeoJSON does not support circles natively
  const highlightPoly = circleToPolygon(
    [loc.long, loc.lat],
    config.highlightRadiusMeters,
    config.highlightEdges,
  );
  const coordinates = highlightPoly?.coordinates?.[0] ?? [];
  const overlay = {
    path: {
      coordinates,
      ...config.path,
    },
  };
  const outline = {
    path: {
      coordinates,
      strokeWidth: config.path.strokeWidth + 2,
      strokeColor: 'fff',
    },
  };

  try {
    const client = new mapbox({
      accessToken: import.meta.env.VITE_MAPBOX_TOKEN as string,
    });
    const staticService = mapboxStatic(client);

    const req = staticService.getStaticImage({
      ownerId: config.ownerId,
      styleId: config.styleId,
      width: config.width,
      height: config.height,
      position,
      overlays: [outline, overlay],
      highRes: config.highRes,
    });

    return req.url();
  } catch (err) {
    if (err) {
      console.error(
        'Error creating map client. Please make sure you are building with an environment variable named `VITE_MAPBOX_TOKEN`, either in your session or in an `env.local` file.',
      );
    }

    return null;
  }
}
