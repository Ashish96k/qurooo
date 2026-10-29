const THUMBNAIL_SIZE = 96;
const THUMBNAIL_QUALITY = 0.72;

function drawThumbnail(source: CanvasImageSource, size: number): string | null {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  context.drawImage(source, 0, 0, size, size);
  return canvas.toDataURL("image/jpeg", THUMBNAIL_QUALITY);
}

export async function createHistoryThumbnail(
  blob: Blob,
  size = THUMBNAIL_SIZE,
): Promise<string | null> {
  try {
    if (typeof createImageBitmap === "function") {
      const bitmap = await createImageBitmap(blob);
      const dataUrl = drawThumbnail(bitmap, size);
      bitmap.close();
      return dataUrl;
    }
  } catch {
    // Fall through to the image-element path.
  }

  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(drawThumbnail(image, size));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    image.src = url;
  });
}
