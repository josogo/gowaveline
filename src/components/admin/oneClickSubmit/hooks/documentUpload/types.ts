
export interface UploadDocumentOptions {
  file: File;
  applicationId?: string;
  documentType?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface DocumentFile {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  document_type: string;
  created_at: string;
}
