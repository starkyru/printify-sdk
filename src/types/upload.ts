export interface UploadImageByUrlRequest {
  file_name: string;
  url: string;
}

export interface UploadImageByBase64Request {
  file_name: string;
  contents: string;
}

export type UploadImageRequest = UploadImageByUrlRequest | UploadImageByBase64Request;

export interface UploadedImage {
  id: string;
  file_name: string;
  height: number;
  width: number;
  size: number;
  mime_type: string;
  preview_url: string;
  upload_url: string;
}
