
import React from 'react';
import DocumentsSection from '../DocumentsSection';
import { useParams } from 'react-router-dom';

export const DocumentsForm: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  
  return (
    <div className="space-y-6">
      <DocumentsSection applicationId={applicationId || ''} />
    </div>
  );
};

export default DocumentsForm;
