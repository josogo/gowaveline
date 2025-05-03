
export interface DocumentFile {
  id: string;
  merchant_id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  created_at: string;
}

export interface DocumentViewItem {
  id: string;
  name: string;
  uploadDate: string;
  size: number;
  filePath: string;
  fileType: string;
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
