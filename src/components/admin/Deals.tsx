import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  ArrowUp, 
  ArrowDown, 
  Upload, 
  Users, 
  FileText, 
  Calendar,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Briefcase,
  Tag,
  ClipboardList,
  BadgePercent
} from 'lucide-react';
import { toast } from 'sonner';
import { useCrmData, Deal, DealDocument } from '@/contexts/CrmDataContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Contact } from '../admin/contacts/types';

const dealSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  value: z.number().min(1, 'Value must be greater than 0'),
  contactName: z.string().min(1, 'Contact name is required'),
  status: z.enum(['pending', 'closed', 'lost']),
  assignedTo: z.string().min(1, 'Please assign this deal to a team member')
});

const documentSchema = z.object({
  name: z.string().min(1, 'Document name is required'),
  type: z.enum(['statement', 'bank', 'corp_docs', 'license', 'void_check', 'tax_return', 'other']),
  file: z.any().optional()
});

const DealsContent = () => {
  const { deals, setDeals, teamMembers, contacts, linkContactToDeal } = useCrmData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDocUploadOpen, setIsDocUploadOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<string | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Deal>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const dealIdFromUrl = queryParams.get('dealId');
  
  const form = useForm<z.infer<typeof dealSchema>>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      name: '',
      value: 0,
      contactName: '',
      status: 'pending',
      assignedTo: ''
    }
  });
  
  const docForm = useForm<z.infer<typeof documentSchema>>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: '',
      type: 'statement'
    }
  });
  
  useEffect(() => {
    if (dealIdFromUrl) {
      const deal = deals.find(d => d.id === dealIdFromUrl);
      if (deal) {
        setSelectedDeal(deal);
        setIsDetailOpen(true);
      }
    }
  }, [dealIdFromUrl, deals]);
  
  const openEditDialog = (deal: Deal) => {
    setEditingDeal(deal.id);
    form.reset({
      name: deal.name,
      value: deal.value,
      contactName: deal.contactName,
      status: deal.status,
      assignedTo: deal.assignedTo
    });
    setIsDialogOpen(true);
  };
  
  const openAddDialog = () => {
    setEditingDeal(null);
    form.reset({
      name: '',
      value: 0,
      contactName: '',
      status: 'pending',
      assignedTo: ''
    });
    setIsDialogOpen(true);
  };
  
  const openDealDetail = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsDetailOpen(true);
    navigate(`/admin/deals?dealId=${deal.id}`, { replace: true });
  };
  
  const closeDealDetail = () => {
    setIsDetailOpen(false);
    setSelectedDeal(null);
    navigate('/admin/deals', { replace: true });
  };
  
  const handleSubmit = (values: z.infer<typeof dealSchema>) => {
    if (editingDeal) {
      setDeals(prev => prev.map(deal => 
        deal.id === editingDeal ? {
          ...deal,
          ...values
        } : deal
      ));
      toast.success('Deal updated successfully');
    } else {
      const newDeal: Deal = {
        id: Date.now().toString(),
        name: values.name,
        value: values.value,
        status: values.status,
        contactName: values.contactName,
        assignedTo: values.assignedTo,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setDeals(prev => [...prev, newDeal]);
      toast.success('Deal created successfully');
    }
    setIsDialogOpen(false);
  };
  
  const handleDocumentSubmit = (values: z.infer<typeof documentSchema>) => {
    if (!selectedDeal) return;
    
    const mockDocument: DealDocument = {
      id: Date.now().toString(),
      name: values.name,
      type: values.type,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Current User',
      fileUrl: '#',
      fileType: 'application/pdf',
      fileSize: 1024 * 1024 * 2
    };
    
    setDeals(prev => prev.map(deal => {
      if (deal.id === selectedDeal.id) {
        const documents = deal.documents || [];
        return {
          ...deal,
          documents: [...documents, mockDocument]
        };
      }
      return deal;
    }));
    
    setIsDocUploadOpen(false);
    docForm.reset();
    toast.success('Document uploaded successfully');
  };
  
  const handleDelete = (id: string) => {
    setDeals(prev => prev.filter(deal => deal.id !== id));
    toast.success('Deal deleted successfully');
  };
  
  const handleStatusChange = (id: string, status: 'pending' | 'closed' | 'lost') => {
    setDeals(prev => prev.map(deal => 
      deal.id === id ? { ...deal, status } : deal
    ));
    toast.success(`Deal marked as ${status}`);
  };
  
  const handleSortChange = (field: keyof Deal) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleLinkContact = (contactId: string) => {
    if (!selectedDeal) return;
    
    linkContactToDeal(contactId, selectedDeal.id);
    toast.success('Contact linked to deal');
  };
  
  const filteredDeals = useMemo(() => {
    return deals
      .filter(deal => 
        deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.contactName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortField === 'value') {
          return sortDirection === 'asc' 
            ? a.value - b.value 
            : b.value - a.value;
        } else {
          const valueA = a[sortField]?.toString() || '';
          const valueB = b[sortField]?.toString() || '';
          return sortDirection === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
      });
  }, [deals, searchQuery, sortField, sortDirection]);
  
  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'closed': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'lost': return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTeamMemberName = (id: string) => {
    const member = teamMembers.find(member => member.id === id);
    return member ? member.name : 'Unassigned';
  };
  
  const getSortIcon = (field: keyof Deal) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };
  
  const getRelatedContacts = (dealId: string) => {
    const deal = deals.find(d => d.id === dealId);
    if (!deal || !deal.relatedContacts) return [];
    
    return contacts.filter(contact => 
      deal.relatedContacts?.includes(contact.id)
    );
  };
  
  const getDocumentTypeLabel = (type: string) => {
    switch(type) {
      case 'statement': return 'Merchant Statement';
      case 'bank': return 'Bank Statement';
      case 'corp_docs': return 'Corporation Documents';
      case 'license': return 'License';
      case 'void_check': return 'Void Check';
      case 'tax_return': return 'Tax Return';
      case 'other': return 'Other Document';
      default: return type;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-orange-500">Deals Management</CardTitle>
              <CardDescription>Track your pending and closed deals</CardDescription>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Deal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Search deals..." 
              className="pl-10" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSortChange('name')}
                  >
                    <div className="flex items-center">
                      Business Name
                      {getSortIcon('name')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSortChange('value')}
                  >
                    <div className="flex items-center">
                      Value
                      {getSortIcon('value')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSortChange('contactName')}
                  >
                    <div className="flex items-center">
                      Contact
                      {getSortIcon('contactName')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSortChange('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {getSortIcon('status')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSortChange('assignedTo')}
                  >
                    <div className="flex items-center">
                      Assigned To
                      {getSortIcon('assignedTo')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No deals found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeals.map((deal) => (
                    <TableRow key={deal.id} className="cursor-pointer hover:bg-gray-50" onClick={() => openDealDetail(deal)}>
                      <TableCell className="font-medium">{deal.name}</TableCell>
                      <TableCell>${deal.value.toLocaleString()}</TableCell>
                      <TableCell>{deal.contactName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadgeColor(deal.status)}>
                          {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{getTeamMemberName(deal.assignedTo)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog(deal);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(deal.id, 'closed');
                            }}>
                              Mark as Closed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(deal.id, 'pending');
                            }}>
                              Mark as Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(deal.id, 'lost');
                            }}>
                              Mark as Lost
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(deal.id);
                              }}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{editingDeal ? 'Edit Deal' : 'Add New Deal'}</DialogTitle>
            <DialogDescription>
              {editingDeal 
                ? 'Update the details for this deal.' 
                : 'Fill in the information below to add a new deal.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter business name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deal Value ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter value" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">{editingDeal ? 'Save Changes' : 'Create Deal'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDetailOpen} onOpenChange={closeDealDetail}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto p-0">
          {selectedDeal && (
            <div className="flex flex-col h-full">
              <DialogHeader className="px-6 py-4 border-b sticky top-0 bg-white z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="text-xl font-bold text-gray-800">{selectedDeal.name}</DialogTitle>
                    <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Created on {new Date(selectedDeal.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={`${getStatusBadgeColor(selectedDeal.status)} px-3 py-1 text-xs font-medium`}>
                    {selectedDeal.status === 'pending' && <Clock className="h-3.5 w-3.5 mr-1 inline" />}
                    {selectedDeal.status === 'closed' && <CheckCircle2 className="h-3.5 w-3.5 mr-1 inline" />}
                    {selectedDeal.status === 'lost' && <XCircle className="h-3.5 w-3.5 mr-1 inline" />}
                    {selectedDeal.status.charAt(0).toUpperCase() + selectedDeal.status.slice(1)}
                  </Badge>
                </div>
              </DialogHeader>
              
              <div className="p-6 flex-grow overflow-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 space-y-6">
                    <div className="bg-gray-50 rounded-lg p-5 border">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Briefcase className="h-5 w-5 mr-2 text-orange-500" />
                        Deal Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Value:</span>
                          <div className="font-semibold text-lg flex items-center text-green-700">
                            <DollarSign className="h-4 w-4" />
                            {selectedDeal.value.toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Primary Contact:</span>
                          <div className="font-medium">{selectedDeal.contactName}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Assigned To:</span>
                          <div className="font-medium flex items-center">
                            <User className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                            {getTeamMemberName(selectedDeal.assignedTo)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Expected Commission:</span>
                          <div className="font-medium flex items-center text-orange-700">
                            <BadgePercent className="h-3.5 w-3.5 mr-1.5" />
                            ${(selectedDeal.value * 0.35).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-5 border">
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <Tag className="h-5 w-5 mr-2 text-orange-500" />
                        Actions
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          variant="outline"
                          className="flex items-center justify-center"
                          onClick={() => openEditDialog(selectedDeal)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Deal
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex items-center justify-center"
                          onClick={() => setIsDocUploadOpen(true)}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Document
                        </Button>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-1">
                        <Button 
                          className={`w-full ${selectedDeal.status === 'closed' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                          disabled={selectedDeal.status === 'closed'}
                          onClick={() => {
                            handleStatusChange(selectedDeal.id, 'closed');
                          }}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark as Closed
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Tabs defaultValue="contacts" className="w-full">
                      <TabsList className="w-full grid grid-cols-2 mb-2">
                        <TabsTrigger value="contacts" className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Related Contacts
                        </TabsTrigger>
                        <TabsTrigger value="documents" className="flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Documents
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="contacts" className="p-0">
                        <div className="bg-white rounded-lg border p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-sm flex items-center">
                              <Users className="h-4 w-4 mr-1.5 text-orange-500" />
                              Linked Contacts
                            </h4>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Plus className="h-3.5 w-3.5 mr-1" />
                                  Link Contact
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56">
                                <div className="px-2 py-1.5 text-sm font-semibold">Select Contact</div>
                                <DropdownMenuSeparator />
                                {contacts
                                  .filter(c => !selectedDeal.relatedContacts?.includes(c.id))
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
                                {contacts.filter(c => !selectedDeal.relatedContacts?.includes(c.id)).length === 0 && (
                                  <DropdownMenuItem disabled className="text-center text-muted-foreground">
                                    No contacts to link
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          {getRelatedContacts(selectedDeal.id).length === 0 ? (
                            <div className="p-8 text-center text-sm text-muted-foreground border border-dashed rounded-md">
                              <Users className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                              <p>No contacts linked to this deal</p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-2"
                                onClick={() => {
                                  const potentialContact = contacts.find(c => c.name === selectedDeal.contactName);
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
                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                              {getRelatedContacts(selectedDeal.id).map(contact => (
                                <div key={contact.id} className="p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <Avatar className="h-10 w-10 mr-3">
                                        <AvatarFallback>{contact.name[0]}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="font-medium">{contact.name}</div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                                          <span>{contact.email}</span>
                                          <span>•</span>
                                          <span>{contact.phone}</span>
                                        </div>
                                        {contact.company && (
                                          <div className="text-xs text-muted-foreground mt-0.5">
                                            {contact.company}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge className="capitalize">
                                        {contact.type}
                                      </Badge>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem onClick={() => setEditingContact && setEditingContact(contact)}>
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
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="documents" className="p-0">
                        <div className="bg-white rounded-lg border p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-sm flex items-center">
                              <ClipboardList className="h-4 w-4 mr-1.5 text-orange-500" />
                              Deal Documents
                            </h4>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setIsDocUploadOpen(true)}
                              className="flex items-center"
                            >
                              <Upload className="h-3.5 w-3.5 mr-1" />
                              Upload Document
                            </Button>
                          </div>
                          
                          {!selectedDeal.documents || selectedDeal.documents.length === 0 ? (
                            <div className="p-8 text-center text-sm text-muted-foreground border border-dashed rounded-md">
                              <FileText className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                              <p>No documents uploaded yet</p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-2"
                                onClick={() => setIsDocUploadOpen(true)}
                              >
                                <Upload className="h-3.5 w-3.5 mr-1" />
                                Upload First Document
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                              {selectedDeal.documents.map(doc => (
                                <div key={doc.id} className="p-3 border rounded-md flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
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
                                    <Button variant="ghost" size="sm" onClick={() => window.open(doc.fileUrl, '_blank')}>
                                      View
                                    </Button>
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
                              ))}
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="px-6 py-4 border-t">
                <Button variant="outline" onClick={closeDealDetail}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDocUploadOpen} onOpenChange={setIsDocUploadOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a document for this deal.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...docForm}>
            <form onSubmit={docForm.handleSubmit(handleDocumentSubmit)} className="space-y-4">
              <FormField
                control={docForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter document name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={docForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="statement">Merchant Statement</SelectItem>
                        <SelectItem value="bank">Bank Statement</SelectItem>
                        <SelectItem value="corp_docs">Corporation Documents</SelectItem>
                        <SelectItem value="license">License</SelectItem>
                        <SelectItem value="void_check">Void Check</SelectItem>
                        <SelectItem value="tax_return">Tax Return</SelectItem>
                        <SelectItem value="other">Other Document</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={docForm.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        className="cursor-pointer" 
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDocUploadOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600">Upload Document</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DealsContent;
