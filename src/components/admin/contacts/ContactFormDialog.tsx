
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Form } from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { Contact } from './types';
import { 
  ContactFormValues,
  contactFormSchema,
  BasicInfoFields,
  ClassificationFields,
  AdditionalFields,
  TagsField,
  NoteAndAddressFields
} from './form';

interface ContactFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ContactFormValues | Contact) => void;
  contact: Contact | null;
}

export const ContactFormDialog: React.FC<ContactFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  contact
}) => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      title: '',
      type: 'lead',
      status: 'new',
      tags: [],
      address: '',
      notes: '',
      assignedTo: '',
    }
  });
  
  // Reset form when dialog opens/closes or contact changes
  useEffect(() => {
    if (isOpen) {
      if (contact) {
        // Fill form with contact data for editing
        form.reset({
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          company: contact.company || '',
          title: contact.title || '',
          type: contact.type,
          status: contact.status,
          tags: contact.tags,
          address: contact.address || '',
          notes: contact.notes || '',
          assignedTo: contact.assignedTo || '',
        });
      } else {
        // Reset form for new contact
        form.reset({
          name: '',
          email: '',
          phone: '',
          company: '',
          title: '',
          type: 'lead',
          status: 'new',
          tags: [],
          address: '',
          notes: '',
          assignedTo: '',
        });
      }
    }
  }, [isOpen, contact, form]);

  const handleSubmit = (values: ContactFormValues) => {
    if (contact) {
      // For editing, pass the ID along
      onSubmit({
        ...values,
        id: contact.id,
        createdAt: contact.createdAt
      });
    } else {
      // For new contact
      onSubmit(values);
    }
  };

  // Sample tags for the multi-select
  const availableTags = [
    'VIP', 'Enterprise', 'SMB', 'Startup', 'Tech', 
    'Retail', 'Healthcare', 'Finance', 'High Priority', 'Hot Lead'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {contact ? 'Edit Contact' : 'Add New Contact'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <BasicInfoFields form={form} />
            <ClassificationFields form={form} />
            <AdditionalFields form={form} />
            <TagsField form={form} availableTags={availableTags} />
            <NoteAndAddressFields form={form} />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                {contact ? 'Save Changes' : 'Add Contact'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
