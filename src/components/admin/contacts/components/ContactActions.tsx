
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ChevronRight } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Contact } from '../types';

interface ContactActionsProps {
  contact: Contact;
  onEdit?: (contact: Contact) => void;
  onDelete?: (id: string) => void;
  navigateToDeals?: () => void;
}

export const ContactActions: React.FC<ContactActionsProps> = ({
  contact,
  onEdit,
  onDelete,
  navigateToDeals
}) => {
  return (
    <TooltipProvider>
      <div className="flex justify-end gap-2">
        {onEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => onEdit(contact)}>
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit Contact</TooltipContent>
          </Tooltip>
        )}
        
        {onDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onDelete(contact.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete Contact</TooltipContent>
          </Tooltip>
        )}
        
        {navigateToDeals && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={navigateToDeals}
                className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>View Deals</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};
