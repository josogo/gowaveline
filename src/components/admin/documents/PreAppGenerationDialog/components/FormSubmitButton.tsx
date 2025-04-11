
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormSubmitButtonProps {
  isGenerating: boolean;
  isDisabled: boolean;
}

export const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({
  isGenerating,
  isDisabled
}) => {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        type="submit" 
        className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80" 
        disabled={isGenerating || isDisabled}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate Application"
        )}
      </Button>
    </div>
  );
};
