
import { ChevronLeft, ChevronRight, Send, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationControlsProps {
  currentTabIndex: number;
  totalTabs: number;
  onNavigate: (direction: 'next' | 'prev') => void;
  onSendToMerchant: () => void;
  onBankRouting?: () => void;
  readOnly?: boolean;
}

export const NavigationControls = ({
  currentTabIndex,
  totalTabs,
  onNavigate,
  onSendToMerchant,
  onBankRouting,
  readOnly
}: NavigationControlsProps) => {
  return (
    <div className="flex justify-between mt-8 sticky bottom-4 bg-white p-4 border rounded-lg shadow-lg">
      <Button
        variant="outline"
        onClick={() => onNavigate('prev')}
        disabled={currentTabIndex === 0}
        className="hover:bg-orange-50 hover:text-orange-600 transition-colors"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>
      
      <div className="flex gap-2">
        {onBankRouting && (
          <Button 
            onClick={onBankRouting} 
            variant="outline"
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-all"
          >
            <Building2 className="mr-2 h-4 w-4" />
            Submit to Banks
          </Button>
        )}
        {currentTabIndex === totalTabs - 1 ? (
          <Button 
            onClick={onSendToMerchant} 
            disabled={readOnly}
            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 transition-all"
          >
            <Send className="mr-2 h-4 w-4" />
            Send to Merchant
          </Button>
        ) : (
          <Button 
            onClick={() => onNavigate('next')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
