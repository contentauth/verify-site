// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import ImageReducer from 'image-blob-reduce';

const RESIZE_MAX_SIZE = 512;
const RESIZE_JPEG_QUALITY = 0.7;

const imageReducer = ImageReducer();

export async function resizeImage(sourceImage: Blob): Promise<Blob> {
  const resizedCanvas = await imageReducer.toCanvas(sourceImage, {
    max: RESIZE_MAX_SIZE,
  });

  const resizedImage = await exportCanvas(resizedCanvas);

  return resizedImage;
}

async function exportCanvas(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        blob ? resolve(blob) : reject();
      },
      'image/jpeg',
      RESIZE_JPEG_QUALITY,
    );
  });
}
