// Image Configuration for CDN
// This file centralizes all image URL management for easy switching between CDN providers

// Choose your CDN provider: 'cloudinary' | 'imgur' | 's3' | 'local'
export const CDN_PROVIDER = 'cloudinary';

// CDN Configuration
export const CDN_CONFIG = {
  cloudinary: {
    cloudName: 'drhvaqfux',
    baseUrl: 'https://res.cloudinary.com/drhvaqfux/image/upload',
    folder: 'reef-forge', // Your main folder in Cloudinary
  },
  imgur: {
    baseUrl: 'https://i.imgur.com',
  },
  s3: {
    bucket: 'your-bucket-name',
    region: 'us-east-1',
    baseUrl: 'https://your-bucket-name.s3.us-east-1.amazonaws.com',
  },
  local: {
    baseUrl: '/images/products',
  },
};

/**
 * Generate image URL based on configured CDN provider
 * @param imagePath - The image filename or path (can include subfolders)
 * @param transformations - Optional transformations (for Cloudinary)
 * @returns Full image URL
 */
export function getImageUrl(
  imagePath: string,
  transformations?: string
): string {
  const provider = CDN_PROVIDER as 'cloudinary' | 'imgur' | 's3' | 'local';

  switch (provider) {
    case 'cloudinary':
      const { cloudName, folder } = CDN_CONFIG.cloudinary;
      const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
      // If folder is specified, prepend it to the path
      // imagePath can include subfolders like "subfolder/image.jpg"
      const path = `${imagePath}`;
      return `${baseUrl}/${path}`;

    case 'imgur':
      return `${CDN_CONFIG.imgur.baseUrl}/${imagePath}`;

    case 's3':
      return `${CDN_CONFIG.s3.baseUrl}/${imagePath}`;

    case 'local':
      return `${CDN_CONFIG.local.baseUrl}/${imagePath}`;

    default:
      return imagePath;
  }
}

/**
 * Generate multiple image URLs for product gallery
 * @param imagePaths - Array of image filenames
 * @returns Array of full image URLs
 */
export function getProductImages(imagePaths: string[]): string[] {
  return imagePaths.map(path => getImageUrl(path));
}

/**
 * Get optimized thumbnail URL (smaller size for cards)
 * @param imagePath - The image filename
 * @returns Optimized thumbnail URL
 */
export function getThumbnailUrl(imagePath: string): string {
  if (CDN_PROVIDER === 'cloudinary') {
    return getImageUrl(imagePath, 'c_fill,w_400,h_400,q_auto,f_auto');
  }
  return getImageUrl(imagePath);
}

/**
 * Get hero/large image URL (high quality for hero sections)
 * @param imagePath - The image filename
 * @returns High quality image URL
 */
export function getHeroImageUrl(imagePath: string): string {
  if (CDN_PROVIDER === 'cloudinary') {
    return getImageUrl(imagePath, 'c_fill,w_1200,h_1200,q_90,f_auto');
  }
  return getImageUrl(imagePath);
}
