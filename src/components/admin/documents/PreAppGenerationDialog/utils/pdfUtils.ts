
/**
 * Converts a base64 string to a Blob object
 * Handles various formats of base64 strings including those with and without data URI prefix
 */
export function base64ToBlob(base64String: string, type: string = 'application/pdf'): Blob {
  try {
    // Input validation
    if (!base64String || typeof base64String !== 'string') {
      console.error('Invalid base64 string received:', typeof base64String);
      throw new Error('Invalid PDF data received');
    }

    // Check if the string has a data URI prefix (e.g., data:application/pdf;base64,)
    const hasPrefix = base64String.includes('data:');
    
    // Extract just the base64 data
    let base64Data: string;
    if (hasPrefix && base64String.includes(',')) {
      base64Data = base64String.split(',')[1];
    } else {
      base64Data = base64String;
    }

    // Remove any whitespace or line breaks that could invalidate the base64 string
    const cleanedBase64 = base64Data.replace(/[\s\r\n]+/g, '');

    // Handle padding
    const paddingNeeded = cleanedBase64.length % 4;
    const paddedBase64 = paddingNeeded > 0 
      ? cleanedBase64 + '='.repeat(4 - paddingNeeded) 
      : cleanedBase64;

    console.log('Converting base64 to blob, string length:', paddedBase64.length);

    // Decode the base64 string to binary
    const binaryString = window.atob(paddedBase64);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create and return the blob
    const blob = new Blob([bytes], { type });
    console.log('Created blob with size:', blob.size, 'bytes');
    
    if (blob.size < 100) {
      console.warn('Warning: PDF blob size is suspiciously small:', blob.size, 'bytes');
    }

    return blob;
  } catch (error: any) {
    console.error('Error in base64ToBlob conversion:', error);
    throw new Error(`Failed to convert PDF data: ${error.message}`);
  }
}
