export type ContactInfo = {
  companyName?: string;
  email?: string;
  phone?: string;
};

export interface FileUploadOptions {
  contactInfo?: ContactInfo;
  onFilesChange?: (files: File[]) => void;
  maxSize?: number;
  accept?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FileOperationResult {
  success: boolean;
  message?: string;
  data?: any;
}
