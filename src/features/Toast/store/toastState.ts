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

import { writable } from 'svelte/store';

export interface ToastOptions {
  messageId: string;
  duration: number;
}

export interface ToastItem {
  id: number;
  messageId: string;
  close: () => void;
}

export function createToast() {
  const toasts = writable<ToastItem[]>([]);
  let toastId = 0;

  function createToast({ messageId, duration }: ToastOptions): ToastItem {
    const id = toastId++;

    function close() {
      toasts.update((toasts) => toasts.filter((t) => t.id !== id));
    }

    setTimeout(close, duration);

    return {
      id,
      messageId,
      close,
    };
  }

  return {
    subscribe: toasts.subscribe,
    trigger: (options: ToastOptions) => {
      toasts.update((toasts) => {
        return [...toasts, createToast(options)];
      });
    },
  };
}

export const toast = createToast();
