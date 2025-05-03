
import React from 'react';
import { Folder } from 'lucide-react';

export const NoDocuments: React.FC = () => {
  return (
    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
      <Folder className="mx-auto h-10 w-10 text-gray-400 mb-2" />
      <h3 className="text-gray-600 font-medium mb-1">No documents yet</h3>
      <p className="text-gray-500 text-sm">
        Upload a document using the form above
      </p>
    </div>
  );
};

export default NoDocuments;
