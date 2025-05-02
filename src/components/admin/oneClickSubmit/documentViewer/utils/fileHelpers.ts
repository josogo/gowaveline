
import { format } from 'date-fns';

export const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'MMMM d, yyyy');
  } catch (e) {
    return 'N/A';
  }
};

export const getFileTypeDisplay = (fileName: string, fileType?: string) => {
  if (!fileType) return 'Unknown';
  
  if (fileType.includes('pdf')) {
    return 'PDF Document';
  } else if (fileType.includes('image')) {
    return 'Image';
  } else if (fileType.includes('word')) {
    return 'Word Document';
  } else {
    return fileType.split('/').pop() || 'Document';
  }
};

export const isPreviewable = (fileType?: string) => {
  if (!fileType) return false;
  return fileType.includes('pdf') || fileType.includes('image');
};
