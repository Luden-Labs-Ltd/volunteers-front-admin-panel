export interface Image {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  key: string; // S3 key/path
  url: string; // Public URL
  bucket: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateImageRequest {
  file: File;
  folder?: string;
}

export interface UpdateImageRequest {
  filename?: string;
  originalName?: string;
}
