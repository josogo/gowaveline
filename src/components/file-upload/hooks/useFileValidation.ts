
import { toast } from "sonner";
import { ValidationResult } from '../types';

interface FileValidationOptions {
  maxSize: number;
  accept?: string;
}

export const useFileValidation = ({ maxSize, accept }: FileValidationOptions) => {
  const validateFile = (file: File): ValidationResult => {
    const allowedTypes = accept ? accept.split(',') : [
      'application/pdf',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    const isTypeValid = allowedTypes.some(type => {
      if (file.type && type.includes('/') && file.type.match(new RegExp(type.replace('*', '.*')))) {
        return true;
      }
      if (type.startsWith('.') && file.name.toLowerCase().endsWith(type.toLowerCase())) {
        return true;
      }
      return false;
    });
    
    if (!isTypeValid) {
      toast.error("Please upload a file with the correct format");
      return { isValid: false, error: "Invalid file type" };
    }
    
    if (file.size > maxSize) {
      toast.error(`File size should be less than ${(maxSize / (1024 * 1024)).toFixed(1)}MB`);
      return { isValid: false, error: "File too large" };
    }
    
    return { isValid: true };
  };

  return { validateFile };
};
