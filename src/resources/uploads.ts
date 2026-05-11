import { BaseResource } from '../base-resource.js';
import { assertSafeStringId } from '../validation.js';
import type { UploadImageRequest, UploadedImage } from '../types/index.js';

export class UploadsResource extends BaseResource {
  /**
   * Upload an image by URL or base64-encoded contents.
   *
   * When uploading by URL, the URL must use HTTPS.
   */
  async uploadImage(data: UploadImageRequest): Promise<UploadedImage> {
    if ('url' in data) {
      let parsed: URL;
      try {
        parsed = new URL(data.url);
      } catch {
        throw new Error(`Invalid upload URL: "${data.url}"`);
      }
      if (parsed.protocol !== 'https:') {
        throw new Error('Upload URL must use HTTPS');
      }
    }
    return this.httpPost<UploadedImage>('/uploads/images.json', data);
  }

  /**
   * Get an uploaded image by ID.
   */
  async getImage(imageId: string): Promise<UploadedImage> {
    assertSafeStringId(imageId, 'imageId');
    return this.httpGet<UploadedImage>(`/uploads/images/${imageId}.json`);
  }

  /**
   * Archive (soft-delete) an uploaded image.
   */
  async archiveImage(imageId: string): Promise<void> {
    assertSafeStringId(imageId, 'imageId');
    await this.httpPost(`/uploads/images/${imageId}/archive.json`);
  }
}
