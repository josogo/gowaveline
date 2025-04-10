
export * from './types';
export * from './DocumentsHeader';
export * from './DocumentCard';
export * from './DocumentsList';
export * from './DocumentUploadDialog';
export * from './DocumentViewDialog';
export * from './DocumentEditDialog';
export * from './DocumentFillDialog';
export * from './PreAppGenerationDialog';
export * from './api';
// Export form items without causing type conflicts
export { 
  documentFormSchema, 
  DocumentFormValues,
  DocumentForm,
  BasicInfoFields,
  DocumentTypeField,
  TemplateToggleField,
  // Export DocumentType from form explicitly to avoid ambiguity
  DocumentType as DocumentFormType
} from './form';

