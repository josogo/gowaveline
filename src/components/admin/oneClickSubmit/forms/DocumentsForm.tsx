import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, FileCheck, FileMinus, Upload, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useDocumentUpload } from '../hooks/useDocumentUpload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

export const DocumentsForm: React.FC = () => {
  const { watch } = useFormContext();
  const { applicationId } = useParams<{ applicationId: string }>();
  const { uploading, documents, uploadDocument, loadDocuments } = useDocumentUpload(applicationId || '');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('bank_statement');
  
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleDocumentTypeChange = (value: string) => {
    setDocumentType(value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      return;
    }
    
    await uploadDocument({
      file: selectedFile,
      applicationId: applicationId || '',
      documentType,
      onSuccess: () => {
        setSelectedFile(null);
      }
    });
  };
  
  const documentGroups = React.useMemo(() => {
    const groups: Record<string, any[]> = {};
    
    (documents || []).forEach((doc) => {
      const groupKey = doc.document_type || 'other';
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(doc);
    });
    
    return groups;
  }, [documents]);
  
  const documentTypeOptions = [
    { value: 'bank_statement', label: 'Bank Statement' },
    { value: 'processing_statement', label: 'Processing Statement' },
    { value: 'business_license', label: 'Business License' },
    { value: 'voided_check', label: 'Voided Check' },
    { value: 'ein_letter', label: 'EIN Letter' },
    { value: 'articles_of_incorporation', label: 'Articles of Incorporation' },
    { value: 'website_terms', label: 'Website Terms & Conditions' },
    { value: 'privacy_policy', label: 'Privacy Policy' },
    { value: 'identity_document', label: 'Identity Document' },
    { value: 'other', label: 'Other' }
  ];
  
  const requiredDocTypes = ['bank_statement', 'business_license', 'voided_check', 'privacy_policy'];
  const requiredCompleted = requiredDocTypes.filter(type => documentGroups[type]?.length > 0).length;
  const requiredProgress = requiredDocTypes.length > 0 
    ? (requiredCompleted / requiredDocTypes.length) * 100 
    : 0;
    
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-transparent border-blue-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <FileCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-800">Document Collection</h3>
              <p className="text-blue-700 mt-1">
                Complete documentation increases your approval chances by 3x
              </p>
              
              <div className="mt-4">
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-blue-800">Required Documents</span>
                  <span className="text-blue-800">{requiredCompleted} of {requiredDocTypes.length} Complete</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${requiredProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="documentType">Document Type</Label>
                <Select 
                  value={documentType} 
                  onValueChange={handleDocumentTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="documentFile">File</Label>
                <div className="mt-1">
                  <input
                    type="file"
                    id="documentFile"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <label htmlFor="documentFile">
                    <div className="flex items-center justify-center w-full h-10 border-2 border-dashed rounded-md border-gray-300 hover:border-gray-400 cursor-pointer">
                      <div className="flex items-center">
                        <Upload className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-500">
                          {selectedFile ? selectedFile.name : 'Choose file...'}
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={!selectedFile || uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
      
      {Object.entries(documentGroups).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(documentGroups).map(([type, docs]) => (
            <div key={type} className="space-y-4">
              <h3 className="text-lg font-medium capitalize">{type.replace('_', ' ')} Documents</h3>
              <div className="grid grid-cols-1 gap-4">
                {docs.map((doc) => (
                  <Card key={doc.id} className="border-green-200">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="rounded-full bg-green-100 p-2 mr-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.file_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <a
                        href={`${supabase.storage.from('merchant-documents').getPublicUrl(doc.file_path).data.publicUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Alert>
          <AlertDescription>
            No documents have been uploaded yet. Upload your first document using the form above.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DocumentsForm;
