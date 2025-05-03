
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import DocumentsSection from '../DocumentsSection';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Save, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const DocumentsForm: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const form = useFormContext();
  const [localApplicationId, setLocalApplicationId] = useState<string | undefined>(applicationId);
  
  // Check if we're in a form context and if we can access form data
  const formData = form?.getValues ? form.getValues() : null;
  const isDirty = form?.formState?.isDirty;
  
  // Use form ID or application ID from URL, prioritizing form data
  useEffect(() => {
    const formId = formData?.id;
    
    if (formId && formId !== localApplicationId) {
      console.log(`[DocumentsForm] Setting application ID from form: ${formId}`);
      setLocalApplicationId(formId);
    } else if (applicationId && !localApplicationId) {
      console.log(`[DocumentsForm] Setting application ID from URL: ${applicationId}`);
      setLocalApplicationId(applicationId);
    }
  }, [formData, applicationId, localApplicationId]);
  
  const handleSaveForm = () => {
    if (form?.handleSubmit) {
      form.handleSubmit((data) => {
        console.log('Form saved successfully', data);
        
        // If the saved form now has an ID, update our local application ID
        if (data.id && data.id !== localApplicationId) {
          setLocalApplicationId(data.id);
        }
        
        toast.success("Application saved successfully");
      })();
    }
  };

  if (!localApplicationId) {
    return (
      <div className="space-y-6">
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-800" />
          <AlertTitle className="text-amber-800 font-medium">Save Required</AlertTitle>
          <AlertDescription className="flex flex-col space-y-4">
            <p className="text-amber-800">
              Please save the application first to enable document uploads.
            </p>
            {form && (
              <Button 
                onClick={handleSaveForm} 
                className="w-fit bg-amber-800 hover:bg-amber-900 text-white"
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
      <DocumentsSection applicationId={localApplicationId} />
    </div>
  );
};

export default DocumentsForm;
