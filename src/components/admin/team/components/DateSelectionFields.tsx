
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface DateSelectionFieldsProps {
  effectiveDate: Date | null;
  expirationDate: Date | null;
  onEffectiveDateChange: (date: Date | null) => void;
  onExpirationDateChange: (date: Date | null) => void;
}

export const DateSelectionFields: React.FC<DateSelectionFieldsProps> = ({
  effectiveDate,
  expirationDate,
  onEffectiveDateChange,
  onExpirationDateChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Effective Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {effectiveDate ? format(effectiveDate, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={effectiveDate} onSelect={onEffectiveDateChange} initialFocus />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label>Expiration Date (optional)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {expirationDate ? format(expirationDate, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={expirationDate} onSelect={onExpirationDateChange} initialFocus />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
