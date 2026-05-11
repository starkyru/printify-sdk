import { BaseResource } from '../base-resource.js';
import type { UploadImageRequest, UploadedImage } from '../types/index.js';

export class UploadsResource extends BaseResource {
  /**
   * Upload an image by URL or base64-encoded contents.
   */
  async uploadImage(data: UploadImageRequest): Promise<UploadedImage> {
    return this.httpPost<UploadedImage>('/uploads/images.json', data);
  }

  /**
   * Get an uploaded image by ID.
   */
  async getImage(imageId: string): Promise<UploadedImage> {
    return this.httpGet<UploadedImage>(`/uploads/images/${imageId}.json`);
  }

  /**
   * Archive (soft-delete) an uploaded image.
   */
  async archiveImage(imageId: string): Promise<void> {
    await this.httpPost(`/uploads/images/${imageId}/archive.json`);
  }
}
