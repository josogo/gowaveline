
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Plus, FilePlus, FileUp } from 'lucide-react';
import { DocumentCard } from './DocumentCard';
import { DocumentItem } from './types';

interface DocumentsListProps {
  documents: DocumentItem[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onView: (document: DocumentItem) => void;
  onEdit: (document: DocumentItem) => void;
  onFill: (document: DocumentItem) => void;
  onUploadClick: () => void;
  isAdmin: boolean;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  isLoading,
  onDelete,
  onView,
  onEdit,
  onFill,
  onUploadClick,
  isAdmin
}) => {
  // Define standard document types
  const standardDocs = [
    {
      id: "standard-nda",
      name: "Non-Disclosure Agreement (NDA)",
      description: "Standard Non-Disclosure Agreement for merchant and agent relationships",
      document_type: "nda",
      is_template: true,
      file_path: "templates/nda.pdf",
      file_type: "application/pdf",
      created_at: new Date().toISOString(),
      isStandard: true
    },
    {
      id: "standard-agent-agreement",
      name: "Agent Agreement",
      description: "Standard Agent Agreement for new relationships",
      document_type: "agreement",
      is_template: true,
      file_path: "templates/agent-agreement.pdf",
      file_type: "application/pdf",
      created_at: new Date().toISOString(),
      isStandard: true
    }
  ];
  
  // Combine standard docs with uploaded docs
  const allDocuments = [...standardDocs, ...documents];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (allDocuments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-10 text-center">
          <FileUp className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No documents yet</h3>
          <p className="text-sm text-gray-500 mt-2 mb-6">
            Upload document templates to generate contracts and agreements
          </p>
          <Button onClick={onUploadClick}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Group documents by type
  const groupedDocuments = allDocuments.reduce((acc, doc) => {
    const type = doc.document_type || 'other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(doc);
    return acc;
  }, {} as Record<string, DocumentItem[]>);

  // Display order for document types
  const typeOrder = ['nda', 'agreement', 'contract', 'template', 'other'];

  // Sort document types
  const sortedTypes = Object.keys(groupedDocuments).sort(
    (a, b) => typeOrder.indexOf(a) - typeOrder.indexOf(b)
  );

  return (
    <div className="space-y-8">
      {sortedTypes.map((type) => (
        <div key={type} className="space-y-4">
          <h3 className="font-medium text-lg capitalize">
            {type === 'nda' ? 'Non-Disclosure Agreements' :
             type === 'contract' ? 'Contracts' :
             type === 'agreement' ? 'Agent Agreements' :
             type === 'template' ? 'Templates' : 
             'Other Documents'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedDocuments[type].map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onDelete={document.isStandard ? undefined : () => onDelete(document.id)}
                onView={() => onView(document)}
                onEdit={document.isStandard ? undefined : () => onEdit(document)}
                onFill={document.is_template ? () => onFill(document) : undefined}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
