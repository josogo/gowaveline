
import React, { useEffect, useState } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, UserCircle } from 'lucide-react';

// Define the form schema for team member
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  role: z.string().min(1, { message: "Role is required." }),
  commissionSplit: z.string().min(1, { message: "Commission split is required." }),
  processingVolume: z.string().min(1, { message: "Processing volume is required." }),
  revenueVolume: z.string().min(1, { message: "Revenue volume is required." }),
  profilePicture: z.string().optional()
});

export type TeamMemberFormData = z.infer<typeof formSchema>;
export type TeamMember = TeamMemberFormData & { id: string };

interface TeamMemberFormProps {
  onSubmit: (data: TeamMemberFormData) => void;
  editingMember: TeamMember | null;
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({ onSubmit, editingMember }) => {
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  
  const form = useForm<TeamMemberFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "",
      commissionSplit: "",
      processingVolume: "",
      revenueVolume: "",
      profilePicture: ""
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
        processingVolume: String(editingMember.processingVolume),
        revenueVolume: editingMember.revenueVolume || "",
        profilePicture: editingMember.profilePicture || ""
      });
      
      if (editingMember.profilePicture) {
        setProfileImageUrl(editingMember.profilePicture);
      }
    } else {
      form.reset({
        name: "",
        email: "",
        phone: "",
        role: "",
        commissionSplit: "",
        processingVolume: "",
        revenueVolume: "",
        profilePicture: ""
      });
      setProfileImageUrl("");
    }
  }, [editingMember, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImageUrl(imageUrl);
      
      // Convert to base64 to store in form
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("profilePicture", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col items-center mb-4">
          <FormField
            control={form.control}
            name="profilePicture"
            render={() => (
              <FormItem className="flex flex-col items-center">
                <FormLabel className="cursor-pointer">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-2 border-dashed border-gray-300 hover:border-[#0EA5E9] transition-colors">
                      {profileImageUrl ? (
                        <AvatarImage src={profileImageUrl} alt="Profile picture" />
                      ) : (
                        <AvatarFallback className="bg-gray-100 text-gray-400">
                          <UserCircle className="w-12 h-12" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="absolute bottom-0 right-0 bg-[#0EA5E9] rounded-full p-1">
                      <Upload className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </FormLabel>
                <FormControl>
                  <Input 
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </FormControl>
                <FormDescription className="text-xs text-center">
                  Click to upload profile picture
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
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
        <FormField
          control={form.control}
          name="revenueVolume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Revenue Volume</FormLabel>
              <FormControl>
                <Input placeholder="25,000" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Annual revenue from accounts
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
