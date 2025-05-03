
import React from 'react';
import { FileText, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentViewItem } from '../../hooks/documentUpload/types';

interface DocumentItemProps {
  document: DocumentViewItem;
  onClick: () => void;
}

export const DocumentItem: React.FC<DocumentItemProps> = ({ document, onClick }) => {
  return (
    <div 
      key={document.id} 
      className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-sm cursor-pointer transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2.5 rounded-md ${
          document.fileType?.includes('pdf') ? 'bg-red-50 text-red-600' :
          document.fileType?.includes('image') ? 'bg-blue-50 text-blue-600' :
          'bg-gray-50 text-gray-600'
        }`}>
          <FileText className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-800 truncate">{document.name}</p>
          <p className="text-xs text-gray-500">
            {new Date(document.uploadDate).toLocaleDateString()} • {(document.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      </div>
      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
        <FileCheck className="h-4 w-4" />
        <span className="sr-only">View document</span>
      </Button>
    </div>
  );
};

export default DocumentItem;
