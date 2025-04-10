
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  File,
  FileText,
  FilePen,
  Trash2,
  Eye,
  CheckSquare,
  MoreVertical,
  Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { DocumentItem } from './types';
import { format } from 'date-fns';

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
  // Function to get icon based on document type
  const getDocumentIcon = () => {
    switch (document.document_type) {
      case 'contract':
        return <FileText className="h-6 w-6" />;
      case 'nda':
        return <File className="h-6 w-6" />;
      case 'agreement':
        return <CheckSquare className="h-6 w-6" />;
      default:
        return <File className="h-6 w-6" />;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'N/A';
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col">
      <CardContent className="p-6 flex-grow">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-md">
              {getDocumentIcon()}
            </div>
            <div>
              <h3 className="font-medium">{document.name}</h3>
              <p className="text-sm text-gray-500 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(document.created_at)}
              </p>
            </div>
          </div>

          {(onDelete || onEdit || onFill) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onView}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>
                
                {onEdit && (
                  <DropdownMenuItem onClick={onEdit}>
                    <FilePen className="h-4 w-4 mr-2" />
                    Edit Details
                  </DropdownMenuItem>
                )}
                
                {onFill && (
                  <DropdownMenuItem onClick={onFill}>
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Fill Template
                  </DropdownMenuItem>
                )}
                
                {onDelete && isAdmin && (
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={onDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        {document.description && (
          <p className="text-sm text-gray-600 mt-3">
            {document.description}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
        <div>
          {document.is_template && (
            <Badge variant="outline" className="mr-2 bg-blue-50 text-blue-700 border-blue-200">
              Template
            </Badge>
          )}
          <Badge variant="outline" className="capitalize bg-gray-50">
            {document.document_type || 'Document'}
          </Badge>
        </div>
        
        <div className="flex space-x-2">
          <Button size="sm" variant="ghost" onClick={onView}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          
          {onFill && (
            <Button size="sm" variant="outline" onClick={onFill}>
              <CheckSquare className="h-4 w-4 mr-1" />
              Fill
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
