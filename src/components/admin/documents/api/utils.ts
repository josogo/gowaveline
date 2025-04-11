
export function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Converts a base64 string to a Blob object
 * Handles various formats of base64 strings including those with and without data URI prefix
 */
export function base64ToBlob(base64String: string, type: string): Blob {
  try {
    // Input validation
    if (!base64String || typeof base64String !== 'string') {
      console.error('Invalid base64 string received:', typeof base64String);
      throw new Error('Invalid PDF data received');
    }

    // Check if the string has a data URI prefix (e.g., data:application/pdf;base64,)
    let base64Data: string;
    
    if (base64String.startsWith('data:')) {
      // Extract just the base64 data after the comma
      const parts = base64String.split(',');
      if (parts.length < 2) {
        throw new Error('Invalid data URI format');
      }
      base64Data = parts[1];
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

    console.log(`[API_UTILS] Converting base64 to blob, string length: ${paddedBase64.length}`);

    // For very long base64 strings, process in chunks to avoid memory issues
    const binaryString = atob(paddedBase64);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create and return the blob
    const blob = new Blob([bytes], { type });
    console.log(`[API_UTILS] Created blob with size: ${blob.size} bytes`);
    
    if (blob.size < 100) {
      console.warn(`[API_UTILS] Warning: PDF blob size is suspiciously small: ${blob.size} bytes`);
      
      if (blob.size === 0) {
        throw new Error('Generated PDF has zero size');
      }
    }

    return blob;
  } catch (error: any) {
    console.error('[API_UTILS] Error in base64ToBlob conversion:', error);
    throw new Error(`Failed to convert PDF data: ${error.message}`);
  }
}
