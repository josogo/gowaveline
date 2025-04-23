
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface SubmitButtonProps {
  selectedBanks: number[];
  isSubmitting: boolean;
  onClick: () => void;
}

export const SubmitButton = ({ selectedBanks, isSubmitting, onClick }: SubmitButtonProps) => {
  return (
    <div className="mt-8 flex justify-end">
      <Button 
        onClick={onClick}
        disabled={selectedBanks.length === 0 || isSubmitting}
        className="bg-gradient-to-r from-blue-500 to-blue-600"
      >
        {isSubmitting ? (
          <>
            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Submit to {selectedBanks.length} Banks
          </>
        )}
      </Button>
    </div>
  );
};
