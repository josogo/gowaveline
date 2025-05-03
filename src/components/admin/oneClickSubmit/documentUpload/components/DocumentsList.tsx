
import React from 'react';
import { Loader2 } from 'lucide-react';
import { DocumentViewItem } from '../../hooks/documentUpload/types';
import NoDocuments from './NoDocuments';
import DocumentItem from './DocumentItem';

interface DocumentsListProps {
  documents: DocumentViewItem[];
  isLoading: boolean;
  onViewDocument: (doc: DocumentViewItem) => void;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({ documents, isLoading, onViewDocument }) => {
  // Handle document click
  const handleDocumentClick = (doc: DocumentViewItem) => {
    console.log("Document clicked in list:", doc.name);
    onViewDocument(doc);
  };
  
  if (isLoading) {
    return (
      <div className="py-8 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-gray-600">Loading documents...</span>
      </div>
    );
  }
  
  if (documents.length === 0) {
    return <NoDocuments />;
  }
  
  return (
    <div className="grid gap-3">
      {documents.map((doc) => (
        <DocumentItem 
          key={doc.id} 
          document={doc} 
          onClick={() => handleDocumentClick(doc)} 
        />
      ))}
    </div>
  );
};

export default DocumentsList;
