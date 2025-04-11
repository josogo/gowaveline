
export function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export function base64ToBlob(base64: string, type: string): Blob {
  try {
    // First check if the string is empty or invalid
    if (!base64 || typeof base64 !== 'string') {
      console.error('Invalid base64 string received', base64);
      throw new Error('Invalid PDF data received');
    }
    
    // Remove header if present (data:application/pdf;base64,)
    const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
    
    // Remove any whitespace or invalid characters that may cause issues
    const cleanedBase64 = base64Data.replace(/\s/g, '');
    
    // Make sure to handle padding if needed
    let paddedBase64 = cleanedBase64;
    const paddingNeeded = paddedBase64.length % 4;
    if (paddingNeeded > 0) {
      paddedBase64 += '='.repeat(4 - paddingNeeded);
    }
    
    // Use browser's built-in function to decode base64
    const binaryString = atob(paddedBase64);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return new Blob([bytes], { type });
  } catch (e) {
    console.error('Error in base64ToBlob:', e);
    throw new Error(`Failed to convert PDF data: ${e.message}`);
  }
}
