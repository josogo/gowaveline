import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Contact } from '@/components/admin/contacts/types';
import DealRelatedContact from '../DealRelatedContact';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Mail, Phone, Plus, User, UserPlus, Users } from 'lucide-react';

interface ContactsTabProps {
  relatedContacts: Contact[];
  contacts: Contact[];
  dealContactName: string;
  handleLinkContact: (contactId: string) => void;
  setEditingContact: React.Dispatch<React.SetStateAction<Contact | null>>;
}

const ContactsTab: React.FC<ContactsTabProps> = ({
  relatedContacts,
  contacts,
  dealContactName,
  handleLinkContact,
  setEditingContact
}) => {
  // Filter out contacts that are already linked to this deal
  const availableContacts = contacts.filter(
    contact => !relatedContacts.some(rc => rc.id === contact.id)
  );
  
  return (
    <Card className="shadow-sm border-teal-100">
      <CardHeader className="pb-2 bg-gradient-to-r from-teal-50 to-orange-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center">
            <Users className="h-4 w-4 mr-2 text-teal-500" />
            Related Contacts
          </CardTitle>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="border-teal-200 hover:bg-teal-50"
              >
                <UserPlus className="h-3.5 w-3.5 mr-1" />
                Link Contact
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              {availableContacts.length === 0 ? (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No more contacts to link
                </div>
              ) : (
                availableContacts.map(contact => (
                  <DropdownMenuItem 
                    key={contact.id}
                    onClick={() => handleLinkContact(contact.id)}
                  >
                    <div className="flex flex-col w-full">
                      <span className="font-medium">{contact.name}</span>
                      <span className="text-xs text-muted-foreground">{contact.email}</span>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {/* Primary Contact */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
            <User className="h-3.5 w-3.5 mr-1" />
            Primary Contact
          </h4>
          
          <div className="p-3 border rounded-md bg-white">
            <div className="flex flex-col">
              <div className="font-medium">{dealContactName}</div>
              <div className="mt-2 flex items-center text-sm space-x-4 text-muted-foreground">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                  onClick={() => {/* Add functionality to email contact */}}
                >
                  <Mail className="h-3.5 w-3.5 mr-1" />
                  Email
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                  onClick={() => {/* Add functionality to call contact */}}
                >
                  <Phone className="h-3.5 w-3.5 mr-1" />
                  Call
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Contacts */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
            <Users className="h-3.5 w-3.5 mr-1" />
            Other Contacts ({relatedContacts.length})
          </h4>
          
          {relatedContacts.length === 0 ? (
            <div className="text-center p-6 border border-dashed rounded-lg">
              <Users className="h-10 w-10 mx-auto mb-2 text-gray-300" />
              <p className="text-muted-foreground">No related contacts yet</p>
              <Button 
                variant="outline" 
                size="sm"
                className="mt-2"
                onClick={() => {/* Open dropdown or dialog to add contacts */}}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Link First Contact
              </Button>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {relatedContacts.map(contact => (
                <DealRelatedContact 
                  key={contact.id} 
                  contact={contact} 
                  canRemove={true}
                  onRemoveContact={() => {/* Add functionality to remove contact */}}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactsTab;
