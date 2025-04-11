
export function base64ToBlob(base64: string, type: string = 'application/pdf'): Blob {
  try {
    // Remove header if present (data:application/pdf;base64,)
    const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
    
    // Make sure to handle padding if needed
    let paddedBase64 = base64Data;
    const paddingNeeded = paddedBase64.length % 4;
    if (paddingNeeded > 0) {
      paddedBase64 += '='.repeat(4 - paddingNeeded);
    }
    
    console.log('Converting base64 to blob, string length:', paddedBase64.length);
    
    const binaryString = window.atob(paddedBase64);
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
