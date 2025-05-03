
/**
 * Interface for document file data
 */
export interface DocumentFile {
  id: string;
  name?: string;
  file_name?: string;  // API returns snake_case
  size?: number;
  file_size?: number;  // API returns snake_case
  type?: string;
  file_type?: string;  // API returns snake_case
  file_path?: string;
  document_type?: string;
  documentType?: string; // For compatibility with some component usage
  created_at?: string;
}

/**
 * Interface for document view item
 */
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

/**
 * Interface for upload document options
 */
export interface UploadDocumentOptions {
  file: File;
  applicationId: string;
  documentType: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}
