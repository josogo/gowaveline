import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const MerchantLoginForm: React.FC<{
  onSuccessfulLogin: (appData: any) => void;
  applicationId?: string;
}> = ({ onSuccessfulLogin, applicationId }) => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('merchant_applications')
        .select('*')
        .eq('id', applicationId)
        .eq('otp', otp)
        .single();

      if (error) throw error;

      if (data) {
        // Load the application data including the initial form data
        onSuccessfulLogin({
          ...data,
          application_data: {
            ...data.application_data,
            businessName: data.merchant_name,
            businessEmail: data.merchant_email,
          }
        });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Invalid verification code');
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      <div>
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
          Verification Code
        </label>
        <div className="mt-1">
          <Input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter code"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div>
        <Button type="submit" className="w-full">
          Verify
        </Button>
      </div>
    </form>
  );
};
