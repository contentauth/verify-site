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
import { add as addDate, isValid, parse, parseISO } from 'date-fns';
import debug from 'debug';
import { convert as convertGeo } from 'geo-coordinates-parser';
import { mapKeys, merge } from 'lodash';

const dbg = debug('exif');

// See precision values here: https://en.wikipedia.org/wiki/Decimal_degrees
export const LOCATION_PRECISION = 2;

const EXIF_DATE_FORMAT_STRING = 'yyyy:MM:dd HH:mm:ss X';

export interface ExifTags {
  'dc:creator'?: string;
  'dc:rights'?: string;
  'exif:datetimeoriginal'?: string;
  'exif:exposuretime'?: string | number;
  'exif:fnumber'?: number;
  'exif:gpslatitude'?: string;
  'exif:gpslongitude'?: string;
  'exif:offsettime'?: string;
  'exif:offsettimeoriginal'?: string;
}

declare module 'c2pa' {
  interface ExtendedAssertions {
    'stds.exif': ExifTags;
  }
}

function findExifValue(exif: ExifTags, locations: string[]) {
  return (
    locations
      .map((key) => exif[key as keyof ExifTags])
      .filter((x) => !!x)?.[0] ?? null
  );
}

export function formatExposureTime(time: string | null) {
  if (time === null) {
    return time;
  }

  if (time.indexOf('.') > -1) {
    const secs = parseFloat(time);

    if (secs < 1 && secs > 0) {
      return `1/${Math.round(1 / secs)}`;
    }

    return secs.toFixed(1).replace(/\.0$/, '');
  }

  return time;
}

interface CaptureDetails {
  cameraMake?: string;
  cameraModel?: string;
  lensMake?: string;
  lensModel?: string;
  exposureTime?: string;
  fNumber?: string;
  focalLength?: string;
  iso?: string;
  width?: number;
  height?: number;
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
      value: formatExposureTime(
        findExifValue(exif, ['exif:exposuretime'])?.toString() ?? null,
      ),
    },
    {
      label: 'fNumber',
      value: findExifValue(exif, ['exif:fnumber']),
    },
    {
      label: 'focalLength',
      value: findExifValue(exif, ['exif:focallength'])?.toString() ?? null,
    },
    {
      label: 'iso',
      value:
        findExifValue(exif, [
          'exifex:photographicsensitivity',
          'exif:isospeed',
          'exif:isospeedratings',
        ])?.toString() ?? null,
    },
    {
      label: 'width',
      value: findExifValue(exif, ['exif:imagewidth', 'exif:pixelxdimension']),
    },
    {
      label: 'height',
      value: findExifValue(exif, ['exif:imageheight', 'exif:pixelydimension']),
    },
  ];

  const details = mapping
    .filter(({ value }) => !!value)
    .reduce((acc, { label, value }) => {
      return {
        ...acc,
        [label]: value,
      };
    }, {}) as CaptureDetails;

  dbg('Got capture details', details);

  return details;
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

export function parseDateTime(exif: ExifTags): Date | null {
  const dateTimeOriginal = exif['exif:datetimeoriginal'];
  const dateTimeOffset =
    exif['exif:offsettime'] ?? exif['exif:offsettimeoriginal'] ?? '+00:00';
  const parsedOffset = /^(\+|-)(\d{2}):(\d{2})$/.exec(dateTimeOffset);
  let captureDate = dateTimeOriginal
    ? parse(`${dateTimeOriginal} Z`, EXIF_DATE_FORMAT_STRING, new Date())
    : null;

  // If the official EXIF format doesn't work, try with ISO 8601
  if (!isValid(captureDate) && dateTimeOriginal) {
    captureDate = parseISO(dateTimeOriginal);
  }

  if (!captureDate || !isValid(captureDate)) {
    return null;
  }

  if (captureDate && parsedOffset !== null) {
    const [, prefix, hStr, mStr] = parsedOffset;
    const multiplier = prefix === '-' ? -1 : 1;
    const hours = parseInt(hStr, 10);
    const minutes = parseInt(mStr, 10);

    return addDate(captureDate, {
      hours: hours * multiplier,
      minutes: minutes * multiplier,
    });
  }

  return captureDate;
}

export function selectExif(manifest: Manifest): ExifSummary | null {
  const exif: ExifTags = manifest.assertions
    .get('stds.exif')
    ?.reduce((acc, exif) => {
      const caseInsensitiveData = mapKeys(exif?.data, (_, key) => {
        return key.toLowerCase();
      });

      return merge({}, acc, caseInsensitiveData);
    }, {});

  if (Object.keys(exif).length > 0) {
    dbg('Got EXIF tags', exif);
  }

  if (Object.keys(exif).length > 0) {
    const captureDate = parseDateTime(exif);

    const summary: Omit<ExifSummary, 'mapUrl'> = {
      creator: exif['dc:creator'] ?? null,
      copyright: exif['dc:rights'] ?? null,
      captureDate: isValid(captureDate) ? captureDate : null,
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
  width: 280,
  height: 160,
  zoom: 9,
  highRes: true,
  highlightRadiusMeters: 8500,
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
