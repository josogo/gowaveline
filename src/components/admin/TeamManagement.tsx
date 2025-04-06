
import React, { useState, useEffect } from 'react';
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Edit, Trash2, User, Mail, Phone, Percent } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the form schema for team member
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  role: z.string().min(1, { message: "Role is required." }),
  commissionSplit: z.string().min(1, { message: "Commission split is required." }),
  processingVolume: z.string().min(1, { message: "Processing volume is required." })
});

type TeamMember = z.infer<typeof formSchema> & { id: string };

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'John Smith', email: 'john@gowaveline.com', phone: '555-123-4567', role: 'Sales Representative', commissionSplit: '35%', processingVolume: '425,000' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@gowaveline.com', phone: '555-987-6543', role: 'Account Manager', commissionSplit: '35%', processingVolume: '520,000' },
    { id: '3', name: 'Michael Brown', email: 'michael@gowaveline.com', phone: '555-456-7890', role: 'Sales Representative', commissionSplit: '30%', processingVolume: '310,000' },
    { id: '4', name: 'Lisa Davis', email: 'lisa@gowaveline.com', phone: '555-789-0123', role: 'Sales Representative', commissionSplit: '35%', processingVolume: '410,000' },
    { id: '5', name: 'Robert Wilson', email: 'robert@gowaveline.com', phone: '555-321-6540', role: 'Account Manager', commissionSplit: '30%', processingVolume: '290,000' },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "",
      commissionSplit: "",
      processingVolume: ""
    },
  });

  useEffect(() => {
    if (editingMember) {
      form.reset({
        name: editingMember.name,
        email: editingMember.email,
        phone: editingMember.phone,
        role: editingMember.role,
        commissionSplit: editingMember.commissionSplit,
        processingVolume: editingMember.processingVolume
      });
    } else {
      form.reset({
        name: "",
        email: "",
        phone: "",
        role: "",
        commissionSplit: "",
        processingVolume: ""
      });
    }
  }, [editingMember, form]);

  const handleAddEdit = (values: z.infer<typeof formSchema>) => {
    if (editingMember) {
      // Edit existing team member
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === editingMember.id ? { ...member, ...values } : member
        )
      );
      toast.success("Team member updated successfully!");
    } else {
      // Add new team member
      const newMember = {
        id: Date.now().toString(),
        ...values,
      };
      setTeamMembers(prev => [...prev, newMember]);
      toast.success("Team member added successfully!");
    }
    setIsDialogOpen(false);
    setEditingMember(null);
  };

  const handleDelete = (id: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
    toast.success("Team member removed successfully!");
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setIsDialogOpen(true);
  };

  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-orange-500">Team Management</CardTitle>
              <CardDescription>Manage your sales team members and their roles</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Team Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>{editingMember ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
                  <DialogDescription>
                    {editingMember 
                      ? 'Update the details for this team member.' 
                      : 'Fill in the information below to add a new team member.'}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddEdit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="name@gowaveline.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="555-123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Sales Representative">Sales Representative</SelectItem>
                              <SelectItem value="Account Manager">Account Manager</SelectItem>
                              <SelectItem value="Sales Manager">Sales Manager</SelectItem>
                              <SelectItem value="Team Lead">Team Lead</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="commissionSplit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Commission Split</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select %" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="30%">30%</SelectItem>
                                <SelectItem value="35%">35%</SelectItem>
                                <SelectItem value="40%">40%</SelectItem>
                                <SelectItem value="50%">50%</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription className="text-xs">
                              Based on volume tier
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="processingVolume"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Processing Volume</FormLabel>
                            <FormControl>
                              <Input placeholder="100,000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="bg-[#0EA5E9]">
                        {editingMember ? 'Update' : 'Add Member'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6">
            <Input
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead className="hidden md:table-cell">Volume</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{member.phone}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Percent className="h-3 w-3 mr-1 text-orange-500" />
                          <span>{member.commissionSplit}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">${member.processingVolume}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(member)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(member.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No team members found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagement;
