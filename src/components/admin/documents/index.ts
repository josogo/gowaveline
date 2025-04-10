
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
export * from './PreAppFormSchema';

// Export API functions
export * from './api';

// Export hooks
export * from './hooks';

// Export form items without causing type conflicts
export { 
  documentFormSchema, 
  DocumentForm,
  BasicInfoFields,
  DocumentTypeField,
  TemplateToggleField,
} from './form';

// Export types explicitly with 'export type' syntax
export type { DocumentFormValues } from './form';
export type { DocumentType as DocumentFormType } from './form';
export type { PreAppFormValues } from './PreAppFormSchema';
