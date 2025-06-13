// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { goto } from '$app/navigation';
import { removeParamsFromUrl } from '$lib/navigation';
import dragDrop from 'drag-drop';
import { verifyStore } from '../stores';

export interface DragDropActionParams {
  onDragStateChange: (isDragging: boolean) => void;
}

/** @type {import('svelte/action').Action}  */
export function dragDropAction(
  node: HTMLElement,
  params: DragDropActionParams,
) {
  const { onDragStateChange } = params;

  // This stops the drag state from rapidly changing during drag
  // They also use this pattern in the dragDrop library
  let dragTimeout: ReturnType<typeof setTimeout> | undefined;

  const cleanupDragDrop = dragDrop(node, {
    async onDrop(files: File[]) {
      clearTimeout(dragTimeout);
      onDragStateChange(false);
      const fileArray = Array.from(files);

      if (fileArray.length > 0) {
        try {
          verifyStore.readC2paSource(fileArray[0]);
        } catch (err) {
          // TODO: Line in with new error system
          console.error(err);
          // onError?.(err, getErrorMessage(err));
        } finally {
          const newUrl = removeParamsFromUrl(['source']);

          if (newUrl) {
            goto(newUrl);
          }
        }
      }
    },
    onDragOver() {
      clearTimeout(dragTimeout);
      onDragStateChange(true);
    },
    onDragLeave() {
      dragTimeout = setTimeout(() => {
        onDragStateChange(false);
      }, 50);
    },
  });

  return {
    destroy() {
      cleanupDragDrop();
    },
  };
}
