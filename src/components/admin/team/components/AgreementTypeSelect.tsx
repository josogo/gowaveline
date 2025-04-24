
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AgreementTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const AgreementTypeSelect: React.FC<AgreementTypeSelectProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="agreementType">Agreement Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select agreement type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Agent Agreement">Agent Agreement</SelectItem>
          <SelectItem value="Non-Disclosure Agreement">Non-Disclosure Agreement</SelectItem>
          <SelectItem value="Non-Compete Agreement">Non-Compete Agreement</SelectItem>
          <SelectItem value="Commission Agreement">Commission Agreement</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
