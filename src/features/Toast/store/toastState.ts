// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

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
