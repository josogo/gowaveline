
import React from 'react';
import { Card } from '@/components/ui/card';
import DocumentCollection from './documentUpload/DocumentCollection';

interface DocumentsSectionProps {
  applicationId: string;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({ applicationId }) => {
  if (!applicationId) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">
          No application ID available. Please save the application first.
        </p>
      </Card>
    );
  }

  return <DocumentCollection applicationId={applicationId} />;
};

export default DocumentsSection;
