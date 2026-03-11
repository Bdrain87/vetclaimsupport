/**
 * Shared file processing utilities for AI analysis.
 * Handles base64 conversion, MIME detection, HEIC conversion, and timeout scaling.
 */

/** Convert a File to base64 string using FileReader (no stack overflow on large files). */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data:...;base64, prefix
      const idx = result.indexOf(',');
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

/** Detect file type from MIME and extension (iOS sometimes reports HEIC as empty). */
export function detectFileType(file: File): 'pdf' | 'heic' | 'image' | 'unknown' {
  const type = file.type.toLowerCase();
  const ext = file.name.toLowerCase().split('.').pop() ?? '';

  if (type === 'application/pdf' || ext === 'pdf') return 'pdf';
  if (type === 'image/heic' || type === 'image/heif' || ext === 'heic' || ext === 'heif') return 'heic';
  if (type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff'].includes(ext)) return 'image';
  return 'unknown';
}

/** Convert HEIC image to JPEG via canvas. Returns a new File with image/jpeg type. */
async function heicToJpeg(file: File): Promise<File> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Could not load HEIC image'));
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    ctx.drawImage(img, 0, 0);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Canvas conversion failed'))),
        'image/jpeg',
        0.92,
      );
    });
    return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export interface NormalizedFile {
  base64: string;
  mimeType: string;
}

/**
 * Normalize a file for Gemini: detect type, convert HEIC→JPEG, produce base64+mimeType.
 * For images with empty MIME (iOS), falls back to extension detection.
 */
export async function normalizeFileForGemini(file: File): Promise<NormalizedFile> {
  const fileType = detectFileType(file);

  if (fileType === 'unknown') {
    throw new FileProcessingError('unsupported', 'Upload a PDF, JPEG, or PNG file.');
  }

  let processedFile = file;

  if (fileType === 'heic') {
    try {
      processedFile = await heicToJpeg(file);
    } catch {
      throw new FileProcessingError('unsupported', 'Could not convert HEIC image. Try taking a JPEG photo instead.');
    }
  }

  const mimeType = fileType === 'pdf'
    ? 'application/pdf'
    : processedFile.type || 'image/jpeg';

  const base64 = await fileToBase64(processedFile);

  return { base64, mimeType };
}

/** Get an appropriate timeout (ms) based on file size and type. */
export function getTimeoutForFile(file: File): number {
  const fileType = detectFileType(file);
  if (fileType === 'pdf') return 60_000;
  if (file.size > 5 * 1024 * 1024) return 45_000;
  return 30_000;
}

// ---------------------------------------------------------------------------
// Classified errors
// ---------------------------------------------------------------------------

export type FileErrorKind = 'too-large' | 'timeout' | 'unsupported' | 'unreadable';

export class FileProcessingError extends Error {
  kind: FileErrorKind;
  constructor(kind: FileErrorKind, message: string) {
    super(message);
    this.kind = kind;
    this.name = 'FileProcessingError';
  }
}

/** Classify a caught error into an actionable user message. */
export function classifyError(err: unknown, file: File): { kind: FileErrorKind; message: string } {
  if (err instanceof FileProcessingError) {
    return { kind: err.kind, message: err.message };
  }

  const msg = err instanceof Error ? err.message : String(err);

  if (msg.includes('abort') || msg.includes('timeout') || msg.includes('Timeout')) {
    return { kind: 'timeout', message: 'File took too long to analyze. Try a smaller file or a photo instead.' };
  }

  if (file.size > 20 * 1024 * 1024) {
    return { kind: 'too-large', message: 'File is too large. Try a file under 20 MB.' };
  }

  return { kind: 'unreadable', message: 'AI couldn\'t read this document. Try a clearer photo or paste the text manually.' };
}
