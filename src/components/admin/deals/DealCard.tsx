
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Users } from 'lucide-react';
import { Deal } from '@/contexts/CrmDataContext';
import { Contact } from '@/components/admin/contacts/types';

// Import our newly created components
import { 
  DealHeader, 
  DealInfo, 
  DealActions,
  ContactsTab,
  DocumentsTab,
  DealCardFooter
} from './card';

interface DealCardProps {
  deal: Deal;
  onClose: () => void;
  onEdit: () => void;
  onStatusChange: (status: 'pending' | 'closed' | 'lost') => void;
  onUploadDocument: () => void;
  getTeamMemberName: (id: string) => string;
  getRelatedContacts: (dealId: string) => Contact[];
  handleLinkContact: (contactId: string) => void;
  contacts: Contact[];
  setEditingContact: React.Dispatch<React.SetStateAction<Contact | null>>;
  getDocumentTypeLabel: (type: string) => string;
  getStatusBadgeColor: (status: string) => string;
}

export const DealCard: React.FC<DealCardProps> = ({
  deal,
  onClose,
  onEdit,
  onStatusChange,
  onUploadDocument,
  getTeamMemberName,
  getRelatedContacts,
  handleLinkContact,
  contacts,
  setEditingContact,
  getDocumentTypeLabel,
  getStatusBadgeColor
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const relatedContacts = getRelatedContacts(deal.id);

  return (
    <div className="flex flex-col h-full">
      {/* Card Header */}
      <DealHeader deal={deal} getStatusBadgeColor={getStatusBadgeColor} />

      {/* Card Content - Responsive Layout */}
      <div className="flex-grow overflow-auto p-0">
        <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column - Deal Information */}
          <div className="md:col-span-5 space-y-6">
            {/* Deal Details Card */}
            <DealInfo 
              deal={deal} 
              getTeamMemberName={getTeamMemberName}
              expandedSection={expandedSection}
              onToggleSection={toggleSection}
            />

            {/* Action Buttons Card */}
            <DealActions 
              dealStatus={deal.status}
              onEdit={onEdit}
              onUpload={onUploadDocument}
              onStatusChange={onStatusChange}
            />
          </div>

          {/* Right Column - Contacts and Documents */}
          <div className="md:col-span-7">
            <Tabs defaultValue="contacts" className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-4">
                <TabsTrigger value="contacts" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Contacts
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="contacts" className="p-0 space-y-4">
                {/* Related Contacts Section */}
                <ContactsTab 
                  relatedContacts={relatedContacts}
                  contacts={contacts}
                  dealContactName={deal.contactName}
                  handleLinkContact={handleLinkContact}
                  setEditingContact={setEditingContact}
                />
              </TabsContent>
              
              <TabsContent value="documents" className="p-0 space-y-4">
                {/* Documents Section */}
                <DocumentsTab
                  documents={deal.documents}
                  onUploadDocument={onUploadDocument}
                  getDocumentTypeLabel={getDocumentTypeLabel}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <DealCardFooter onClose={onClose} />
    </div>
  );
};
