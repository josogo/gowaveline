
export interface DocumentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  data?: File | Blob;
  url?: string;
  uploadProgress?: number;
  error?: string;
}

export interface DocumentViewItem {
  id: string;
  name: string;
  uploadDate: string;
  size: number;
  filePath: string;
  fileType: string;
  documentType?: string;
  url?: string;
}

export interface UploadDocumentOptions {
  file: File;
  applicationId: string;
  documentType: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}
