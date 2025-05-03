
import React from 'react';
import { useFormContext } from 'react-hook-form';
import DocumentsSection from '../DocumentsSection';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export const DocumentsForm: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const form = useFormContext();
  
  // Check if we're in a form context and if we can access form data
  const formData = form?.getValues ? form.getValues() : null;
  const isDirty = form?.formState?.isDirty;
  const formId = formData?.id || applicationId;
  
  const handleSaveForm = () => {
    if (form?.handleSubmit) {
      form.handleSubmit(() => {
        console.log('Form saved successfully');
      })();
    }
  };

  if (!formId) {
    return (
      <div className="space-y-6">
        <Alert className="bg-amber-50 border-amber-200">
          <AlertDescription className="flex flex-col space-y-4">
            <p className="text-amber-800">
              Please save the application first to enable document uploads.
            </p>
            {form && (
              <Button 
                onClick={handleSaveForm} 
                className="w-fit"
                variant="outline"
                disabled={!isDirty}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Application
              </Button>
            )}
          </AlertDescription>
        </Alert>
        
        <Card className="bg-gray-50/50">
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              <p>Document uploads will be available after saving the application.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <DocumentsSection applicationId={formId} />
    </div>
  );
};

export default DocumentsForm;
