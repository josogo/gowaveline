
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export type SendToMerchantDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId?: string | number;
  applicationData?: any;
  merchantEmail?: string;
  merchantName?: string;
};

export const SendToMerchantDialog: React.FC<SendToMerchantDialogProps> = ({
  open,
  onOpenChange,
  applicationId,
  applicationData,
  merchantEmail = '',
  merchantName = '',
}) => {
  const [email, setEmail] = useState(merchantEmail || '');
  const [name, setName] = useState(merchantName || '');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    if (!name.trim()) {
      toast.error('Please enter a merchant name');
      return;
    }

    setIsSending(true);
    try {
      // Update the application with merchant details
      if (applicationId) {
        const { error } = await supabase
          .from('merchant_applications')
          .update({
            merchant_email: email,
            merchant_name: name,
            email_sent_at: new Date().toISOString(),
            status: 'sent',
          })
          .eq('id', applicationId.toString()); // Convert applicationId to string

        if (error) throw error;
      }

      // Trigger email sending via Supabase Edge Function
      const { error: sendError } = await supabase.functions.invoke('send-merchant-email', {
        body: {
          applicationId: applicationId ? applicationId.toString() : '', // Convert to string
          merchantEmail: email,
          merchantName: name,
          applicationData,
        },
      });

      if (sendError) throw sendError;

      toast.success('Application sent to merchant successfully!');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error sending application to merchant:', error);
      toast.error(`Failed to send: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send to Merchant</DialogTitle>
          <DialogDescription>
            This will send an email to the merchant with instructions to complete the application.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Merchant Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter merchant name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Merchant Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter merchant's email"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isSending}>
            {isSending ? 'Sending...' : 'Send Application'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendToMerchantDialog;
