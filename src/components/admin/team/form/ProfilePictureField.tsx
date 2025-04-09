
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, Upload } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { TeamMemberFormData } from './types';

interface ProfilePictureFieldProps {
  form: UseFormReturn<TeamMemberFormData>;
  profileImageUrl: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfilePictureField: React.FC<ProfilePictureFieldProps> = ({
  form,
  profileImageUrl,
  onImageChange
}) => {
  return (
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
                onChange={onImageChange}
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
  );
};
