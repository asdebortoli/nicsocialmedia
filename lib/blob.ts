import { put, del } from '@vercel/blob';

/**
 * Uploads an image to Vercel Blob Storage
 */
export async function uploadImage(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const blob = await put(filename, buffer, {
    access: 'public',
    contentType,
  });
  return blob.url;
}

/**
 * Deletes an image from Vercel Blob Storage
 */
export async function deleteImage(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    // If the blob doesn't exist, that's okay - just log it
    console.warn('Failed to delete blob:', url, error);
  }
}

