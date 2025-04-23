
import { renderHook } from '@testing-library/react-hooks';
import { useFileValidation } from '../useFileValidation';
import { toast } from 'sonner';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the toast function
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn()
  }
}));

describe('useFileValidation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should validate file size correctly', () => {
    const { result } = renderHook(() => useFileValidation({ maxSize: 5 * 1024 * 1024 })); // 5MB
    
    // Test file exceeding max size
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
    const largeFileResult = result.current.validateFile(largeFile);
    
    expect(largeFileResult.isValid).toBe(false);
    expect(largeFileResult.error).toBe("File too large");
    expect(toast.error).toHaveBeenCalledWith("File size should be less than 5.0MB");
    
    // Test file within size limit
    const validFile = new File(['x'.repeat(3 * 1024 * 1024)], 'valid.pdf', { type: 'application/pdf' });
    const validFileResult = result.current.validateFile(validFile);
    
    expect(validFileResult.isValid).toBe(true);
    expect(validFileResult.error).toBeUndefined();
  });

  it('should validate file type correctly with default accept types', () => {
    const { result } = renderHook(() => useFileValidation({ maxSize: 10 * 1024 * 1024 }));
    
    // Test valid PDF file
    const pdfFile = new File([''], 'test.pdf', { type: 'application/pdf' });
    const pdfResult = result.current.validateFile(pdfFile);
    expect(pdfResult.isValid).toBe(true);
    
    // Test valid CSV file
    const csvFile = new File([''], 'test.csv', { type: 'text/csv' });
    const csvResult = result.current.validateFile(csvFile);
    expect(csvResult.isValid).toBe(true);
    
    // Test invalid file type
    const imageFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const imageResult = result.current.validateFile(imageFile);
    expect(imageResult.isValid).toBe(false);
    expect(imageResult.error).toBe("Invalid file type");
    expect(toast.error).toHaveBeenCalledWith("Please upload a file with the correct format");
  });

  it('should validate file type correctly with custom accept types', () => {
    const { result } = renderHook(() => 
      useFileValidation({ 
        maxSize: 10 * 1024 * 1024,
        accept: '.jpg,.jpeg,image/jpeg'
      })
    );
    
    // Test valid image file
    const jpegFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const jpegResult = result.current.validateFile(jpegFile);
    expect(jpegResult.isValid).toBe(true);
    
    // Test invalid file type
    const pdfFile = new File([''], 'test.pdf', { type: 'application/pdf' });
    const pdfResult = result.current.validateFile(pdfFile);
    expect(pdfResult.isValid).toBe(false);
    expect(pdfResult.error).toBe("Invalid file type");
  });

  it('should handle file extensions correctly', () => {
    const { result } = renderHook(() => 
      useFileValidation({ 
        maxSize: 10 * 1024 * 1024,
        accept: '.docx'
      })
    );
    
    // Test valid file extension
    const docxFile = new File([''], 'test.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const docxResult = result.current.validateFile(docxFile);
    expect(docxResult.isValid).toBe(true);
    
    // Test invalid file extension
    const txtFile = new File([''], 'test.txt', { type: 'text/plain' });
    const txtResult = result.current.validateFile(txtFile);
    expect(txtResult.isValid).toBe(false);
  });
});

