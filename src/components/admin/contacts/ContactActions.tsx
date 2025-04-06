
import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  FileText,
  Plus,
  Download,
  Upload
} from 'lucide-react';

interface ContactActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onEmail?: () => void;
  onCall?: () => void;
  onSchedule?: () => void;
  onViewDeals?: () => void;
  onAddClick?: () => void;
  onImportExportClick?: () => void;
  selectedCount?: number;
  onBulkDelete?: () => void;
}

export const ContactActions: React.FC<ContactActionsProps> = ({
  onEdit,
  onDelete,
  onEmail,
  onCall,
  onSchedule,
  onViewDeals,
  onAddClick,
  onImportExportClick,
  selectedCount = 0,
  onBulkDelete
}) => {
  // Component for the row-level actions (single contact)
  if (onEdit || onDelete || onEmail || onCall || onSchedule || onViewDeals) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {onEdit && (
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
          )}
          
          {onEmail && (
            <DropdownMenuItem onClick={onEmail}>
              <Mail className="mr-2 h-4 w-4" /> Send Email
            </DropdownMenuItem>
          )}
          
          {onCall && (
            <DropdownMenuItem onClick={onCall}>
              <Phone className="mr-2 h-4 w-4" /> Call
            </DropdownMenuItem>
          )}
          
          {onSchedule && (
            <DropdownMenuItem onClick={onSchedule}>
              <Calendar className="mr-2 h-4 w-4" /> Schedule Meeting
            </DropdownMenuItem>
          )}
          
          {onViewDeals && (
            <DropdownMenuItem onClick={onViewDeals}>
              <FileText className="mr-2 h-4 w-4" /> View Deals
            </DropdownMenuItem>
          )}
          
          {onDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onDelete}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Component for the top-level actions (all contacts)
  return (
    <div className="flex items-center space-x-2">
      {selectedCount > 0 && onBulkDelete && (
        <Button 
          variant="destructive" 
          size="sm"
          onClick={onBulkDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete ({selectedCount})
        </Button>
      )}
      
      {onAddClick && (
        <Button size="sm" onClick={onAddClick} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      )}
      
      {onImportExportClick && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onImportExportClick}
        >
          <Download className="mr-1 h-4 w-4" />
          <Upload className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
