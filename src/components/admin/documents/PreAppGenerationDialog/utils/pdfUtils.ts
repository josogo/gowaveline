
/**
 * Converts a base64 string to a Blob object
 */
export const base64ToBlob = (base64: string, mimeType: string = 'application/pdf'): Blob => {
  // Convert base64 to binary data
  const byteCharacters = atob(base64);
  const byteArrays = [];

  // Split into chunks to avoid memory issues with large files
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: mimeType });
};
