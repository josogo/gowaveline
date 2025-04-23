
import React, { useState } from 'react';
import { Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ApplicationOTPProps {
  otp?: string;
}

export const ApplicationOTP: React.FC<ApplicationOTPProps> = ({ otp }) => {
  const [showOTP, setShowOTP] = useState(false);

  const handleCopyOTP = () => {
    if (otp) {
      navigator.clipboard.writeText(otp);
      toast.success('OTP copied to clipboard');
    }
  };

  return (
    <div className="flex items-center justify-between mt-2">
      <div className="text-xs text-gray-500 flex items-center">
        <Key className="h-3 w-3 mr-1" />
        {showOTP ? (
          <span className="font-mono bg-gray-100 px-1 rounded">
            {otp || 'N/A'}
          </span>
        ) : (
          <span>OTP: ******</span>
        )}
      </div>
      <div className="flex space-x-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            setShowOTP(!showOTP);
          }}
        >
          {showOTP ? 'Hide' : 'Show'} OTP
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            handleCopyOTP();
          }}
        >
          Copy OTP
        </Button>
      </div>
    </div>
  );
};
