
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Edit, 
  Trash2, 
  ChevronRight, 
  Tag, 
  Phone, 
  Mail, 
  Building 
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Contact } from './types';

interface ContactsListProps {
  contacts: Contact[];
  onEdit?: (contact: Contact) => void;
  onDelete?: (id: string) => void;
  navigateToDeals?: () => void;
  selectedContacts?: string[];
  setSelectedContacts?: React.Dispatch<React.SetStateAction<string[]>>;
  onEditContact?: (contact: Contact) => void;
  onDeleteContact?: (id: string) => void;
}

export const ContactsList: React.FC<ContactsListProps> = ({
  contacts,
  onEdit,
  onDelete,
  navigateToDeals,
  selectedContacts = [],
  setSelectedContacts,
  onEditContact,
  onDeleteContact
}) => {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md bg-gray-50">
        <p className="text-gray-500">No contacts found</p>
        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or add a new contact</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'lead': return 'bg-purple-100 text-purple-800';
      case 'churned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lead': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'client': return 'bg-green-100 text-green-800 border-green-200';
      case 'partner': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'vendor': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleToggleSelect = (id: string) => {
    if (!setSelectedContacts) return;
    
    setSelectedContacts(prev => {
      if (prev.includes(id)) {
        return prev.filter(contactId => contactId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleToggleSelectAll = () => {
    if (!setSelectedContacts) return;
    
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(contact => contact.id));
    }
  };

  // Use the appropriate edit/delete handlers
  const handleEdit = onEdit || onEditContact;
  const handleDelete = onDelete || onDeleteContact;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {setSelectedContacts && (
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={selectedContacts.length === contacts.length && contacts.length > 0}
                  onCheckedChange={handleToggleSelectAll}
                />
              </TableHead>
            )}
            <TableHead>Name</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id} className="group">
              {setSelectedContacts && (
                <TableCell>
                  <Checkbox 
                    checked={selectedContacts.includes(contact.id)}
                    onCheckedChange={() => handleToggleSelect(contact.id)}
                  />
                </TableCell>
              )}
              <TableCell className="font-medium">{contact.name}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-gray-400" />
                    <span className="text-sm">{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-gray-400" />
                    <span className="text-sm">{contact.phone}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {contact.company && (
                  <div className="flex items-center gap-1">
                    <Building className="h-3 w-3 text-gray-400" />
                    <span>{contact.company}</span>
                    {contact.title && <span className="text-xs text-gray-500">({contact.title})</span>}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getTypeColor(contact.type)}>
                  {contact.type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(contact.status)}>
                  {contact.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {contact.tags && contact.tags.map((tag, index) => (
                    <div key={index} className="flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <TooltipProvider>
                  <div className="flex justify-end gap-2">
                    {handleEdit && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(contact)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Contact</TooltipContent>
                      </Tooltip>
                    )}
                    
                    {handleDelete && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(contact.id)}
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
