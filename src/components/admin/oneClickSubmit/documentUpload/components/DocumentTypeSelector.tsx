
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DocumentCategory {
  value: string;
  label: string;
}

interface DocumentCategoriesProps {
  banking: DocumentCategory[];
  business: DocumentCategory[];
  processing: DocumentCategory[];
  identity: DocumentCategory[];
  other: DocumentCategory[];
}

interface DocumentTypeSelectorProps {
  documentType: string;
  onDocumentTypeChange: (value: string) => void;
}

export const documentCategories: DocumentCategoriesProps = {
  banking: [
    { value: 'bank_statement', label: 'Bank Statement' },
    { value: 'voided_check', label: 'Voided Check' },
  ],
  business: [
    { value: 'business_license', label: 'Business License' },
    { value: 'ein_letter', label: 'EIN Letter' },
    { value: 'articles_of_incorporation', label: 'Articles of Incorporation' },
  ],
  processing: [
    { value: 'processing_statement', label: 'Processing Statement' },
  ],
  identity: [
    { value: 'drivers_license', label: 'Driver\'s License' },
    { value: 'passport', label: 'Passport' },
  ],
  other: [
    { value: 'contract', label: 'Contract' },
    { value: 'website_terms', label: 'Website Terms & Conditions' },
    { value: 'privacy_policy', label: 'Privacy Policy' },
    { value: 'other', label: 'Other Document' },
  ]
};

const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({
  documentType,
  onDocumentTypeChange
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-700">
        Document Type
      </label>
      <Select 
        value={documentType} 
        onValueChange={onDocumentTypeChange}
      >
        <SelectTrigger className="w-full border-gray-300">
          <SelectValue placeholder="Select document type" />
        </SelectTrigger>
        <SelectContent>
          <div className="px-1 py-1 font-semibold text-xs text-gray-500">BANKING</div>
          {documentCategories.banking.map(({value, label}) => (
            <SelectItem key={value} value={value}>{label}</SelectItem>
          ))}
          
          <div className="px-1 py-1 font-semibold text-xs text-gray-500 mt-1">BUSINESS</div>
          {documentCategories.business.map(({value, label}) => (
            <SelectItem key={value} value={value}>{label}</SelectItem>
          ))}
          
          <div className="px-1 py-1 font-semibold text-xs text-gray-500 mt-1">PROCESSING</div>
          {documentCategories.processing.map(({value, label}) => (
            <SelectItem key={value} value={value}>{label}</SelectItem>
          ))}
          
          <div className="px-1 py-1 font-semibold text-xs text-gray-500 mt-1">IDENTITY</div>
          {documentCategories.identity.map(({value, label}) => (
            <SelectItem key={value} value={value}>{label}</SelectItem>
          ))}
          
          <div className="px-1 py-1 font-semibold text-xs text-gray-500 mt-1">OTHER</div>
          {documentCategories.other.map(({value, label}) => (
            <SelectItem key={value} value={value}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DocumentTypeSelector;
