export function base64ToBlob(base64: string, type: string = 'application/pdf'): Blob {
  try {
    // Remove any non-base64 characters that might cause decoding errors
    // Keep only valid base64 characters (A-Z, a-z, 0-9, +, /, =)
    const cleanBase64 = base64.replace(/[^A-Za-z0-9+/=]/g, '');
    
    // Make sure to handle padding if needed
    let paddedBase64 = cleanBase64;
    const paddingNeeded = cleanBase64.length % 4;
    if (paddingNeeded > 0) {
      paddedBase64 += '='.repeat(4 - paddingNeeded);
    }
    
    // Log for debugging
    console.log('Converting base64 to blob (first 50 chars):', paddedBase64.substring(0, 50) + '...');
    
    const binaryString = window.atob(paddedBase64);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return new Blob([bytes], { type });
  } catch (e) {
    console.error('Error in base64ToBlob:', e);
    throw new Error('Failed to convert PDF data');
  }
}
