
import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogFooter
} from "@/components/ui/dialog";

// Define the form schema for team member
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  role: z.string().min(1, { message: "Role is required." }),
  commissionSplit: z.string().min(1, { message: "Commission split is required." }),
  processingVolume: z.string().min(1, { message: "Processing volume is required." })
});

export type TeamMemberFormData = z.infer<typeof formSchema>;
export type TeamMember = TeamMemberFormData & { id: string };

interface TeamMemberFormProps {
  onSubmit: (data: TeamMemberFormData) => void;
  editingMember: TeamMember | null;
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({ onSubmit, editingMember }) => {
  const form = useForm<TeamMemberFormData>({
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
  );
};

export default TeamMemberForm;
