
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  DialogFooter
} from "@/components/ui/dialog";

import {
  ProfilePictureField,
  BasicInfoFields,
  RoleField,
  SalesInfoFields,
  formSchema,
  TeamMemberFormData, 
  TeamMember
} from './form';

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
        <ProfilePictureField 
          form={form} 
          profileImageUrl={profileImageUrl} 
          onImageChange={handleImageChange} 
        />
        
        <BasicInfoFields form={form} />
        <RoleField form={form} />
        <SalesInfoFields form={form} />
        
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
export type { TeamMember, TeamMemberFormData };
