
export function base64ToBlob(base64: string, type: string = 'application/pdf'): Blob {
  try {
    // Make sure to handle padding if needed
    const paddingNeeded = base64.length % 4;
    if (paddingNeeded > 0) {
      base64 += '='.repeat(4 - paddingNeeded);
    }
    
    const binaryString = window.atob(base64);
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
