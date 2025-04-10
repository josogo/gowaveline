
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  FileText,
  File,
  Eye,
  Edit,
  Trash2,
  FileSignature,
  FileCheck,
  FilePlus,
  FileX,
  Contract,
  FileQuestion
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentItem } from './types';
import { formatDistanceToNow } from 'date-fns';

interface DocumentCardProps {
  document: DocumentItem;
  onDelete?: () => void;
  onView: () => void;
  onEdit?: () => void;
  onFill?: () => void;
  isAdmin: boolean;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onDelete,
  onView,
  onEdit,
  onFill,
  isAdmin,
}) => {
  const getDocumentIcon = () => {
    const type = document.document_type;
    switch (type) {
      case 'nda':
        return <FileCheck className="h-10 w-10 text-[#FF9F5A]" />;
      case 'agreement':
        return <Contract className="h-10 w-10 text-[#FF9F5A]" />;
      case 'contract':
        return <FileSignature className="h-10 w-10 text-[#FF9F5A]" />;
      case 'preapp':
        return <FilePlus className="h-10 w-10 text-[#FF9F5A]" />;
      case 'template':
        return <FileText className="h-10 w-10 text-[#FF9F5A]" />;
      default:
        return <FileQuestion className="h-10 w-10 text-[#FF9F5A]" />;
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
      <CardContent className="p-5 flex flex-col h-full">
        <div className="p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm mb-4 w-fit">
          {getDocumentIcon()}
        </div>
        
        <h3 className="text-lg font-semibold text-[#0EA5E9] mb-2">{document.name}</h3>
        
        {document.description && (
          <p className="text-sm text-[#0EA5E9]/70 mb-3">{document.description}</p>
        )}
        
        <div className="text-xs text-gray-500 mb-4 mt-auto">
          {document.is_template && (
            <span className="inline-block bg-[#0EA5E9]/10 text-[#0EA5E9] rounded-full px-2 py-0.5 text-xs mr-2 mb-1">
              Template
            </span>
          )}
          {document.isStandard && (
            <span className="inline-block bg-[#FF9F5A]/10 text-[#FF9F5A] rounded-full px-2 py-0.5 text-xs mr-2 mb-1">
              Standard
            </span>
          )}
          <p className="mt-1">Added {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}</p>
        </div>
        
        <div className="flex gap-2 pt-3 border-t border-gray-100 mt-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onView}
            className="text-[#0EA5E9] hover:bg-[#0EA5E9]/10"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          
          {onEdit && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onEdit}
              className="text-[#0EA5E9] hover:bg-[#0EA5E9]/10"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
          
          {onFill && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onFill}
              className="text-[#FF9F5A] hover:bg-[#FF9F5A]/10 ml-auto"
            >
              <FileSignature className="h-4 w-4 mr-1" />
              Fill
            </Button>
          )}
          
          {onDelete && isAdmin && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDelete}
              className="text-red-500 hover:bg-red-50 hover:text-red-600 ml-auto"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
