import React, { useState } from 'react';
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
  DialogTrigger,
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
import { Search, Plus, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { useCrmData, Deal } from '@/contexts/CrmDataContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const dealSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  value: z.number().min(1, 'Value must be greater than 0'),
  contactName: z.string().min(1, 'Contact name is required'),
  status: z.enum(['pending', 'closed', 'lost']),
  assignedTo: z.string().min(1, 'Please assign this deal to a team member')
});

const DealsContent = () => {
  const { deals, setDeals, teamMembers } = useCrmData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
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
  
  const filteredDeals = deals.filter(deal => 
    deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.contactName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
                  <TableHead>Business Name</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
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
                    <TableRow key={deal.id}>
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
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(deal)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(deal.id, 'closed')}>
                              Mark as Closed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(deal.id, 'pending')}>
                              Mark as Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(deal.id, 'lost')}>
                              Mark as Lost
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(deal.id)}
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
    </div>
  );
};

export default DealsContent;
