
import React from 'react';
import { Card } from '@/components/ui/card';
import DocumentCollection from './documentUpload/DocumentCollection';

interface DocumentsSectionProps {
  applicationId: string;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({ applicationId }) => {
  // Use a temporary ID if no application ID is available
  const documentSessionId = applicationId === 'temp' ? 
    localStorage.getItem('temp_document_session_id') || `temp_${Date.now()}` : 
    applicationId;
    
  // Store temporary session ID in localStorage if needed
  React.useEffect(() => {
    if (applicationId === 'temp' && !localStorage.getItem('temp_document_session_id')) {
      localStorage.setItem('temp_document_session_id', documentSessionId);
    }
  }, [applicationId, documentSessionId]);

  return <DocumentCollection applicationId={documentSessionId} />;
};

export default DocumentsSection;
