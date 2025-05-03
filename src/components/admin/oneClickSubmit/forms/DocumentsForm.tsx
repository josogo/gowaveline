
import React from 'react';
import { useParams } from 'react-router-dom';
import DocumentsSection from '../DocumentsSection';

export const DocumentsForm: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  
  return (
    <div className="space-y-6">
      <DocumentsSection applicationId={applicationId || 'temp'} />
    </div>
  );
};

export default DocumentsForm;
