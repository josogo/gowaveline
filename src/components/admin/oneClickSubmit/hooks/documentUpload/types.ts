
export interface DocumentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  data?: File | Blob;
  url?: string;
  uploadProgress?: number;
  error?: string;
  // Add the additional fields used by the components
  file_name?: string;
  file_size?: number;
  file_type?: string;
  file_path?: string;
  created_at?: string;
  document_type?: string;
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
