
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationControlsProps {
  currentTabIndex: number;
  totalTabs: number;
  onNavigate: (direction: 'next' | 'prev') => void;
  onSendToMerchant: () => void;
  readOnly?: boolean;
}

export const NavigationControls = ({
  currentTabIndex,
  totalTabs,
  onNavigate,
  onSendToMerchant,
  readOnly
}: NavigationControlsProps) => {
  return (
    <div className="flex justify-between mt-8 sticky bottom-4 bg-white p-4 border rounded-lg shadow-lg">
      <Button
        variant="outline"
        onClick={() => onNavigate('prev')}
        disabled={currentTabIndex === 0}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>
      
      <div className="flex gap-2">
        {currentTabIndex === totalTabs - 1 ? (
          <Button onClick={onSendToMerchant} disabled={readOnly}>
            <Send className="mr-2 h-4 w-4" />
            Send to Merchant
          </Button>
        ) : (
          <Button onClick={() => onNavigate('next')}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
