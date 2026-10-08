/**
 * File & Image Compression Utility for Berean Bible Baptist College Portal
 * Automatically compresses images and uploaded documents to stay under the 5 MB threshold.
 */

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface CompressionResult {
  file: File;
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  wasCompressed: boolean;
  savingsPercent: number;
  originalFormatted: string;
  compressedFormatted: string;
  mimeType: string;
}

export interface DocumentProcessResult {
  file: File;
  dataUrl?: string;
  originalSize: number;
  compressedSize: number;
  wasCompressed: boolean;
  savingsPercent: number;
  originalFormatted: string;
  compressedFormatted: string;
  mimeType: string;
  error?: string;
}

/**
 * Format raw bytes into human-readable string (e.g., "1.4 MB", "520 KB")
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Loads a File into an HTMLImageElement
 */
function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image for processing'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a Canvas to a Blob with given mime type and quality
 */
function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas to Blob conversion failed'));
      },
      mimeType,
      quality
    );
  });
}

/**
 * Converts a Blob to a Base64 data URL
 */
function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Blob to DataURL conversion failed'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Intelligently compresses any uploaded image to guarantee it stays strictly under 5 MB max.
 * For profile pictures and scanned documents, optimizes resolution and applies multi-pass compression.
 */
export async function compressImageFile(
  file: File,
  options: {
    maxSizeBytes?: number;
    maxDimension?: number;
    targetMimeType?: string;
  } = {}
): Promise<CompressionResult> {
  const maxSizeBytes = options.maxSizeBytes || MAX_FILE_SIZE_BYTES;
  const maxDimension = options.maxDimension || 2048; // Max width/height for web rendering
  const originalSize = file.size;

  // If already under target size and small enough dimensions, we can still load it
  const img = await loadImageFromFile(file);

  let { width, height } = img;
  let scale = 1;

  // Scale down dimensions if image is larger than maxDimension
  if (width > maxDimension || height > maxDimension) {
    if (width > height) {
      scale = maxDimension / width;
    } else {
      scale = maxDimension / height;
    }
  }

  const canvas = document.createElement('canvas');
  let currentWidth = Math.round(width * scale);
  let currentHeight = Math.round(height * scale);
  canvas.width = currentWidth;
  canvas.height = currentHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not initialize canvas context');
  }

  // Draw with image smoothing enabled
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, currentWidth, currentHeight);

  // Determine output mime type (use image/jpeg for photos or keep image/png if transparent, but prefer jpeg for size)
  const isPngWithTransparency = file.type === 'image/png';
  const outMime = options.targetMimeType || (isPngWithTransparency ? 'image/png' : 'image/jpeg');

  // Multi-pass compression loop to guarantee <= maxSizeBytes
  let quality = 0.92;
  let blob = await canvasToBlob(canvas, outMime, quality);

  // If initial pass is over maxSizeBytes or if PNG is still over 5MB, switch to JPEG and reduce quality
  if (blob.size > maxSizeBytes && outMime === 'image/png') {
    blob = await canvasToBlob(canvas, 'image/jpeg', 0.88);
  }

  let attempts = 0;
  while (blob.size > maxSizeBytes && attempts < 6) {
    attempts++;
    // Drop quality and reduce dimensions by 15% each iteration
    quality = Math.max(0.4, quality - 0.15);
    currentWidth = Math.round(currentWidth * 0.85);
    currentHeight = Math.round(currentHeight * 0.85);

    canvas.width = currentWidth;
    canvas.height = currentHeight;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, currentWidth, currentHeight);

    blob = await canvasToBlob(canvas, 'image/jpeg', quality);
  }

  const compressedSize = blob.size;
  const wasCompressed = compressedSize < originalSize || attempts > 0 || scale < 1;
  const savingsPercent = originalSize > 0 
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

  const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
    type: blob.type,
    lastModified: Date.now(),
  });

  const dataUrl = await blobToDataUrl(blob);

  return {
    file: compressedFile,
    dataUrl,
    originalSize,
    compressedSize,
    wasCompressed,
    savingsPercent,
    originalFormatted: formatBytes(originalSize),
    compressedFormatted: formatBytes(compressedSize),
    mimeType: blob.type,
  };
}

/**
 * Automatically processes documents and certificates.
 * If image-based (JPG, PNG, WebP), compresses down to <= 5MB.
 * If PDF or other format, verifies size against 5MB limit.
 */
export async function processDocumentFile(
  file: File,
  maxSizeBytes = MAX_FILE_SIZE_BYTES
): Promise<DocumentProcessResult> {
  const originalSize = file.size;

  // Check if it's an image
  if (file.type.startsWith('image/')) {
    const comp = await compressImageFile(file, { maxSizeBytes, maxDimension: 2200 });
    return {
      file: comp.file,
      dataUrl: comp.dataUrl,
      originalSize: comp.originalSize,
      compressedSize: comp.compressedSize,
      wasCompressed: comp.wasCompressed,
      savingsPercent: comp.savingsPercent,
      originalFormatted: comp.originalFormatted,
      compressedFormatted: comp.compressedFormatted,
      mimeType: comp.mimeType,
    };
  }

  // Non-image file (e.g. PDF, Word document)
  if (file.size > maxSizeBytes) {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      wasCompressed: false,
      savingsPercent: 0,
      originalFormatted: formatBytes(originalSize),
      compressedFormatted: formatBytes(originalSize),
      mimeType: file.type || 'application/octet-stream',
      error: `File size (${formatBytes(originalSize)}) exceeds the maximum 5 MB limit. Please select a document under 5 MB or convert to an image format for automatic compression.`,
    };
  }

  return {
    file,
    originalSize,
    compressedSize: originalSize,
    wasCompressed: false,
    savingsPercent: 0,
    originalFormatted: formatBytes(originalSize),
    compressedFormatted: formatBytes(originalSize),
    mimeType: file.type || 'application/octet-stream',
  };
}
