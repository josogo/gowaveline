
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BasicInfoFields, DocumentTypeField, TemplateToggleField } from './index';
import { DocumentFormValues } from './DocumentFormSchema';

interface DocumentFormProps {
  form: UseFormReturn<DocumentFormValues>;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <BasicInfoFields form={form} />
      <DocumentTypeField form={form} />
      <TemplateToggleField form={form} />
    </div>
  );
};
