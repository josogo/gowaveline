
// Export base types
export * from './types';

// Export components
export * from './DocumentsHeader';
export * from './DocumentCard';
export * from './DocumentsList';
export * from './DocumentUploadDialog';
export * from './DocumentViewDialog';
export * from './DocumentEditDialog';
export * from './DocumentFillDialog';
export * from './PreAppGenerationDialog';

// Export API functions
export * from './api';

// Export hooks
export * from './hooks';

// Export form items without causing type conflicts
export { 
  documentFormSchema, 
  DocumentFormValues,
  DocumentForm,
  BasicInfoFields,
  DocumentTypeField,
  TemplateToggleField,
} from './form';

// Export type explicitly to avoid ambiguity
export type { DocumentType as DocumentFormType } from './form';
