// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { customAlphabet } from 'nanoid';

const NANOID_LENGTH = 21;
const NANOID_ALPHABET =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const nanoid = customAlphabet(NANOID_ALPHABET, NANOID_LENGTH);
