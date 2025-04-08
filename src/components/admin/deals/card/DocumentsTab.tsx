
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { ClipboardList, FileText, Upload, MoreHorizontal } from 'lucide-react';
import { DealDocument } from '@/contexts/CrmDataContext';

interface DocumentsTabProps {
  documents: DealDocument[] | undefined;
  onUploadDocument: () => void;
  getDocumentTypeLabel: (type: string) => string;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({
  documents,
  onUploadDocument,
  getDocumentTypeLabel
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center">
            <ClipboardList className="h-4 w-4 mr-2 text-orange-500" />
            Deal Documents
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onUploadDocument}
            className="flex items-center h-8"
          >
            <Upload className="h-3.5 w-3.5 mr-1" />
            Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!documents || documents.length === 0 ? (
          <EmptyDocumentsList onUploadDocument={onUploadDocument} />
        ) : (
          <DocumentsList documents={documents} getDocumentTypeLabel={getDocumentTypeLabel} />
        )}
      </CardContent>
    </Card>
  );
};

// Extracted subcomponent for empty documents list
const EmptyDocumentsList: React.FC<{
  onUploadDocument: () => void;
}> = ({ onUploadDocument }) => (
  <div className="py-6 text-center text-sm text-muted-foreground border border-dashed rounded-md">
    <FileText className="h-10 w-10 mx-auto mb-2 text-gray-300" />
    <p>No documents uploaded yet</p>
    <Button 
      variant="outline" 
      size="sm" 
      className="mt-2"
      onClick={onUploadDocument}
    >
      <Upload className="h-3.5 w-3.5 mr-1" />
      Upload First Document
    </Button>
  </div>
);

// Extracted subcomponent for documents list
const DocumentsList: React.FC<{
  documents: DealDocument[];
  getDocumentTypeLabel: (type: string) => string;
}> = ({ documents, getDocumentTypeLabel }) => (
  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
    {documents.map(doc => (
      <Card key={doc.id} className="border shadow-sm hover:shadow-md transition-shadow">
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-orange-100 p-2 rounded-md mr-3">
              <FileText className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <div className="font-medium">{doc.name}</div>
              <div className="text-xs text-muted-foreground">
                {getDocumentTypeLabel(doc.type)} • {new Date(doc.uploadedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => window.open(doc.fileUrl, '_blank')}>
                  View Document
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Download
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export default DocumentsTab;
