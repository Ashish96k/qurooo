interface QrBarcodeDetector {
  detect: (source: CanvasImageSource) => Promise<Array<{ rawValue?: string }>>;
}

function createBarcodeDetector(): QrBarcodeDetector | null {
  const detector = (
    globalThis as {
      BarcodeDetector?: new (options: { formats: string[] }) => QrBarcodeDetector;
    }
  ).BarcodeDetector;

  if (!detector) {
    return null;
  }

  try {
    return new detector({ formats: ["qr_code"] });
  } catch {
    return null;
  }
}

async function decodeImageData(image: ImageData): Promise<string | null> {
  const jsQR = (await import("jsqr")).default;
  const code = jsQR(image.data, image.width, image.height, {
    inversionAttempts: "attemptBoth",
  });

  return code?.data ?? null;
}

function binarize(image: ImageData, threshold: number): ImageData {
  const copy = new ImageData(new Uint8ClampedArray(image.data), image.width, image.height);
  const pixels = copy.data;

  for (let index = 0; index < pixels.length; index += 4) {
    const luminance = pixels[index] * 0.299 + pixels[index + 1] * 0.587 + pixels[index + 2] * 0.114;
    const value = luminance < threshold ? 0 : 255;
    pixels[index] = value;
    pixels[index + 1] = value;
    pixels[index + 2] = value;
    pixels[index + 3] = 255;
  }

  return copy;
}

/** Read a QR payload from the painted preview. Returns null when the pixels do not decode. */
export async function readQrFromCanvas(canvas: HTMLCanvasElement): Promise<string | null> {
  if (canvas.width < 32 || canvas.height < 32) {
    return null;
  }

  const detector = createBarcodeDetector();

  if (detector) {
    try {
      const codes = await detector.detect(canvas);
      const value = codes.find((code) => code.rawValue)?.rawValue;

      if (value) {
        return value;
      }
    } catch {
      // The browser detector can reject some canvas states. Fall through to jsQR.
    }
  }

  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    return null;
  }

  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  const direct = await decodeImageData(image);

  if (direct) {
    return direct;
  }

  for (const threshold of [150, 190, 220]) {
    const decoded = await decodeImageData(binarize(image, threshold));

    if (decoded) {
      return decoded;
    }
  }

  return null;
}
