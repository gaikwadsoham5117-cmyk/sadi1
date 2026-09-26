/**
 * Utility for Cloudinary responsive transformations, WebP/AVIF optimization, and fallbacks
 */

interface TransformOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | 'auto:good' | 'auto:best' | number;
  crop?: 'fill' | 'scale' | 'fit' | 'thumb';
  format?: 'auto' | 'webp' | 'avif' | 'jpg';
}

export function getCloudinaryUrl(
  url: string,
  options: TransformOptions = {}
): string {
  if (!url) {
    return 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405329/virasat_sarees/purple_paithani.jpg';
  }

  // If already a Cloudinary URL, insert transform parameters
  if (url.includes('res.cloudinary.com')) {
    const {
      width = 800,
      height,
      quality = 'auto',
      crop = 'fill',
      format = 'auto'
    } = options;

    const transforms = [
      `f_${format}`,
      `q_${quality}`,
      `c_${crop}`,
      `w_${width}`,
      height ? `h_${height}` : ''
    ].filter(Boolean).join(',');

    // Insert transforms before /v1... or after /upload/
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex !== -1) {
      const prefix = url.substring(0, uploadIndex + 8);
      const rest = url.substring(uploadIndex + 8);
      // Avoid duplicating transformations if already present
      if (rest.startsWith('f_') || rest.startsWith('c_') || rest.startsWith('w_')) {
        const nextSlash = rest.indexOf('/');
        return prefix + transforms + '/' + rest.substring(nextSlash + 1);
      }
      return `${prefix}${transforms}/${rest}`;
    }
  }

  return url;
}
