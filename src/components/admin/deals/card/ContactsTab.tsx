
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Users, Plus, MoreHorizontal, Edit } from 'lucide-react';
import { Contact } from '@/components/admin/contacts/types';

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
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center">
            <Users className="h-4 w-4 mr-2 text-orange-500" />
            Related Contacts
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Link Contact
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm font-semibold">Select Contact</div>
              <DropdownMenuSeparator />
              {contacts
                .filter(c => !relatedContacts.some(rc => rc.id === c.id))
                .map(contact => (
                  <DropdownMenuItem 
                    key={contact.id}
                    onClick={() => handleLinkContact(contact.id)}
                    className="flex items-center cursor-pointer"
                  >
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback className="text-xs">{contact.name[0]}</AvatarFallback>
                    </Avatar>
                    {contact.name}
                  </DropdownMenuItem>
                ))
              }
              {contacts.filter(c => !relatedContacts.some(rc => rc.id === c.id)).length === 0 && (
                <DropdownMenuItem disabled className="text-center text-muted-foreground">
                  No contacts to link
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {relatedContacts.length === 0 ? (
          <EmptyContactsList dealContactName={dealContactName} handleLinkContact={handleLinkContact} contacts={contacts} />
        ) : (
          <ContactList contacts={relatedContacts} setEditingContact={setEditingContact} />
        )}
      </CardContent>
    </Card>
  );
};

// Extracted subcomponent for empty contacts list
const EmptyContactsList: React.FC<{
  dealContactName: string;
  handleLinkContact: (contactId: string) => void;
  contacts: Contact[];
}> = ({ dealContactName, handleLinkContact, contacts }) => (
  <div className="py-6 text-center text-sm text-muted-foreground border border-dashed rounded-md">
    <Users className="h-10 w-10 mx-auto mb-2 text-gray-300" />
    <p>No contacts linked to this deal</p>
    <Button 
      variant="outline" 
      size="sm" 
      className="mt-2"
      onClick={() => {
        const potentialContact = contacts.find(c => c.name === dealContactName);
        if (potentialContact) {
          handleLinkContact(potentialContact.id);
        }
      }}
    >
      <Plus className="h-3.5 w-3.5 mr-1" />
      Link Primary Contact
    </Button>
  </div>
);

// Extracted subcomponent for contacts list
const ContactList: React.FC<{
  contacts: Contact[];
  setEditingContact: React.Dispatch<React.SetStateAction<Contact | null>>;
}> = ({ contacts, setEditingContact }) => (
  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
    {contacts.map(contact => (
      <Card key={contact.id} className="p-3 border shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <Avatar className="h-10 w-10 mr-3 mt-0.5">
              <AvatarFallback>{contact.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="font-medium hover:text-orange-600 transition-colors cursor-pointer">
                      {contact.name}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="p-4 space-y-1">
                    <p className="font-medium">{contact.name}</p>
                    <div className="text-xs flex items-center gap-1">
                      <span className="text-muted-foreground">Email:</span> 
                      <span>{contact.email}</span>
                    </div>
                    <div className="text-xs flex items-center gap-1">
                      <span className="text-muted-foreground">Phone:</span> 
                      <span>{contact.phone}</span>
                    </div>
                    {contact.company && (
                      <div className="text-xs flex items-center gap-1">
                        <span className="text-muted-foreground">Company:</span> 
                        <span>{contact.company}</span>
                      </div>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                <span>{contact.email}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                <span>{contact.phone}</span>
                {contact.company && (
                  <span> • {contact.company}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditingContact(contact)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Contact
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  Remove from Deal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export default ContactsTab;
