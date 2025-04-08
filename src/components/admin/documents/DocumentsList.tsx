
import React from 'react';
import { DocumentCard } from './DocumentCard';
import { Document } from './types';
import { FileText, Plus } from 'lucide-react';

interface DocumentsListProps {
  documents: Document[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onView: (document: Document) => void;
  onEdit: (document: Document) => void;
  onFill: (document: Document) => void;
  isAdmin: boolean;
  onUploadClick: () => void;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  isLoading,
  onDelete,
  onView,
  onEdit,
  onFill,
  isAdmin,
  onUploadClick,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-200 h-12 w-12 rounded"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-lg">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No documents found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by uploading your first document.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={onUploadClick}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
            Upload Document
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          onDelete={onDelete}
          onView={onView}
          onEdit={onEdit}
          onFill={onFill}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
};
