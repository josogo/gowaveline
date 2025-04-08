
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  Edit,
  FileText,
  MoreHorizontal,
  Plus,
  Upload,
  User,
  Users,
  BadgePercent,
  ClipboardList,
  X
} from 'lucide-react';
import { Deal, DealDocument } from '@/contexts/CrmDataContext';
import { Contact } from '../contacts/types';

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
  getDocumentTypeLabel
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'closed': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'lost': return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const relatedContacts = getRelatedContacts(deal.id);

  return (
    <div className="flex flex-col h-full">
      {/* Card Header */}
      <div className="sticky top-0 bg-white z-10 border-b p-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{deal.name}</h2>
            <div className="flex items-center gap-2 mt-1.5 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>Created on {new Date(deal.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <Badge 
            variant="outline" 
            className={`${getStatusBadgeColor(deal.status)} px-3 py-1 text-sm font-medium flex items-center`}
          >
            {deal.status === 'pending' && <Clock className="h-3.5 w-3.5 mr-1.5" />}
            {deal.status === 'closed' && <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />}
            {deal.status === 'lost' && <X className="h-3.5 w-3.5 mr-1.5" />}
            {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Card Content - Responsive Layout */}
      <div className="flex-grow overflow-auto p-0">
        <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column - Deal Information */}
          <div className="md:col-span-5 space-y-6">
            {/* Deal Details Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-orange-500" />
                    Deal Information
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => toggleSection('details')}
                  >
                    {expandedSection === 'details' ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                    }
                  </Button>
                </div>
              </CardHeader>
              <CardContent className={expandedSection !== null && expandedSection !== 'details' ? 'hidden' : ''}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Value:</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="font-semibold text-lg flex items-center text-green-700">
                            <DollarSign className="h-4 w-4" />
                            {deal.value.toLocaleString()}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-sm">Deal value: ${deal.value.toLocaleString()}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Primary Contact:</span>
                    <div className="font-medium">{deal.contactName}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Assigned To:</span>
                    <div className="font-medium flex items-center">
                      <User className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                      {getTeamMemberName(deal.assignedTo)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Expected Commission:</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="font-medium flex items-center text-orange-700">
                            <BadgePercent className="h-3.5 w-3.5 mr-1.5" />
                            ${(deal.value * 0.35).toLocaleString()}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-sm">35% of deal value</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-orange-500" />
                    Actions
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant="outline"
                    className="flex-1 flex items-center justify-center"
                    onClick={onEdit}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1 flex items-center justify-center"
                    onClick={onUploadDocument}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </div>
                <div className="mt-3">
                  <Button 
                    className={`w-full ${deal.status === 'closed' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                    disabled={deal.status === 'closed'}
                    onClick={() => onStatusChange('closed')}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark as Closed
                  </Button>
                </div>
              </CardContent>
            </Card>
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
                            .filter(c => !deal.relatedContacts?.includes(c.id))
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
                          {contacts.filter(c => !deal.relatedContacts?.includes(c.id)).length === 0 && (
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
                      <div className="py-6 text-center text-sm text-muted-foreground border border-dashed rounded-md">
                        <Users className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                        <p>No contacts linked to this deal</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => {
                            const potentialContact = contacts.find(c => c.name === deal.contactName);
                            if (potentialContact) {
                              handleLinkContact(potentialContact.id);
                            }
                          }}
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Link Primary Contact
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                        {relatedContacts.map(contact => (
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
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="documents" className="p-0 space-y-4">
                {/* Documents Section */}
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
                    {!deal.documents || deal.documents.length === 0 ? (
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
                    ) : (
                      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                        {deal.documents.map(doc => (
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
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <CardFooter className="border-t p-4 mt-auto flex justify-end bg-gray-50">
        <Button variant="outline" onClick={onClose}>Close</Button>
      </CardFooter>
    </div>
  );
};
