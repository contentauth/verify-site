// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { ToastOptions } from '../store/toastState';

export const matchesUnavailable = (): ToastOptions => ({
  messageId: 'toast.matchesUnavailable',
  duration: 5000,
});

export const unsupportedFileType = (): ToastOptions => ({
  messageId: 'toast.unsupportedFileType',
  duration: 5000,
});

export const somethingWentWrong = (): ToastOptions => ({
  messageId: 'toast.somethingWentWrong',
  duration: 5000,
});
