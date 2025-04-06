
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
  FileText 
} from 'lucide-react';

interface ContactActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onEmail?: () => void;
  onCall?: () => void;
  onSchedule?: () => void;
  onViewDeals?: () => void;
}

export const ContactActions: React.FC<ContactActionsProps> = ({
  onEdit,
  onDelete,
  onEmail,
  onCall,
  onSchedule,
  onViewDeals
}) => {
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
        
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
        
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
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={onDelete}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
