import qrcode from "qrcode-generator";

import type {
  ErrorCorrectionLevel,
  FrameStyle,
  QrEditorState,
} from "@/features/qr/model/types";

export interface QrMatrix {
  size: number;
  modules: boolean[][];
}

export interface StyledQrRenderModel {
  matrix: QrMatrix;
  primaryColor: string;
  secondaryColor: string;
  gradientEnabled: boolean;
  gradientDirection: string;
  backgroundColor: string;
  frameStyle: FrameStyle;
  logoScale: number;
  margin: number;
}

type QrTypeNumber = Parameters<typeof qrcode>[0];

export function createQrMatrix(
  payload: string,
  errorCorrection: ErrorCorrectionLevel = "H",
  /** Force a denser QR (more modules). 0 = auto version. */
  minTypeNumber: QrTypeNumber = 0,
): QrMatrix {
  const data = payload || "https://qurooo.app";

  const build = (typeNumber: QrTypeNumber) => {
    const qr = qrcode(typeNumber, errorCorrection);
    qr.addData(data);
    qr.make();
    const size = qr.getModuleCount();
    const modules = Array.from({ length: size }, (_, row) =>
      Array.from({ length: size }, (_, col) => qr.isDark(row, col)),
    );
    return { size, modules };
  };

  if (minTypeNumber > 0) {
    try {
      return build(minTypeNumber);
    } catch {
      // Data too long for forced version — fall back to auto.
    }
  }

  return build(0);
}

export function createStyledRenderModel(
  payload: string,
  state: Pick<QrEditorState, "style">,
): StyledQrRenderModel {
  return {
    matrix: createQrMatrix(payload, state.style.errorCorrection),
    primaryColor: state.style.primaryColor,
    secondaryColor: state.style.secondaryColor,
    gradientEnabled: state.style.gradientEnabled,
    gradientDirection: state.style.gradientDirection,
    backgroundColor: state.style.backgroundColor,
    frameStyle: state.style.frameStyle,
    logoScale: state.style.logoScale,
    margin: state.style.margin,
  };
}
