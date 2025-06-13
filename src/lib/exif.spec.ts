// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { describe, expect, it } from 'vitest';
import { formatExposureTime, parseDateTime } from './exif';

describe('lib/exif', () => {
  it('should format exposure times properly', () => {
    expect(formatExposureTime(`${1 / 8000}`)).toEqual('1/8000');
    expect(formatExposureTime(`${1 / 2500}`)).toEqual('1/2500');
    expect(formatExposureTime(`${1 / 1000}`)).toEqual('1/1000');
    expect(formatExposureTime(`${1 / 500}`)).toEqual('1/500');
    expect(formatExposureTime(`${1 / 250}`)).toEqual('1/250');
    expect(formatExposureTime(`${1 / 125}`)).toEqual('1/125');
    expect(formatExposureTime(`${1 / 60}`)).toEqual('1/60');
    expect(formatExposureTime(`${1 / 30}`)).toEqual('1/30');
    expect(formatExposureTime(`${1 / 15}`)).toEqual('1/15');
    expect(formatExposureTime(`${1 / 8}`)).toEqual('1/8');
    expect(formatExposureTime(`${1 / 4}`)).toEqual('1/4');
    expect(formatExposureTime(`${1 / 2}`)).toEqual('1/2');
    expect(formatExposureTime(`1`)).toEqual('1');
    expect(formatExposureTime(`1.55`)).toEqual('1.6');
    expect(formatExposureTime(`2.0`)).toEqual('2');
  });

  it('should parse dates correctly', () => {
    expect(
      parseDateTime({
        'exif:datetimeoriginal': '2023:08:30 19:46:27',
      }),
    ).toEqual(new Date('2023-08-30T19:46:27.000Z'));

    expect(
      parseDateTime({
        'exif:datetimeoriginal': '2023:08:30 19:46:27',
        'exif:offsettime': '+02:00',
      }),
    ).toEqual(new Date('2023-08-30T21:46:27.000Z'));

    expect(
      parseDateTime({
        'exif:datetimeoriginal': '2023:08:30 19:46:27',
        'exif:offsettime': '+04:30',
      }),
    ).toEqual(new Date('2023-08-31T00:16:27.000Z'));

    expect(
      parseDateTime({
        'exif:datetimeoriginal': '2023:08:30 19:46:27',
        'exif:offsettime': '-04:30',
      }),
    ).toEqual(new Date('2023-08-30T15:16:27.000Z'));

    expect(
      parseDateTime({
        'exif:datetimeoriginal': '2023:08:30 19:46:27',
        'exif:offsettimeoriginal': '-02:00',
      }),
    ).toEqual(new Date('2023-08-30T17:46:27.000Z'));
  });
});
