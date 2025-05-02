
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, FileCheck, Upload, Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useDocumentUpload } from '../hooks/useDocumentUpload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export const DocumentsForm: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const { uploading, documents, uploadDocument, loadDocuments } = useDocumentUpload(applicationId || '');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('bank_statement');
  const [activeTab, setActiveTab] = useState('required');
  
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
    { value: 'bank_statement', label: 'Bank Statement', category: 'required', icon: <FileCheck className="h-4 w-4 text-blue-500" /> },
    { value: 'processing_statement', label: 'Processing Statement', category: 'required', icon: <FileCheck className="h-4 w-4 text-blue-500" /> },
    { value: 'business_license', label: 'Business License', category: 'required', icon: <FileCheck className="h-4 w-4 text-blue-500" /> },
    { value: 'voided_check', label: 'Voided Check', category: 'required', icon: <FileCheck className="h-4 w-4 text-blue-500" /> },
    { value: 'ein_letter', label: 'EIN Letter', category: 'business', icon: <FileCheck className="h-4 w-4 text-green-500" /> },
    { value: 'articles_of_incorporation', label: 'Articles of Incorporation', category: 'business', icon: <FileCheck className="h-4 w-4 text-green-500" /> },
    { value: 'website_terms', label: 'Website Terms & Conditions', category: 'website', icon: <FileCheck className="h-4 w-4 text-purple-500" /> },
    { value: 'privacy_policy', label: 'Privacy Policy', category: 'website', icon: <FileCheck className="h-4 w-4 text-purple-500" /> },
    { value: 'identity_document', label: 'Identity Document', category: 'identity', icon: <FileCheck className="h-4 w-4 text-amber-500" /> },
    { value: 'other', label: 'Other Document', category: 'other', icon: <FileCheck className="h-4 w-4 text-gray-500" /> }
  ];
  
  const requiredDocTypes = ['bank_statement', 'processing_statement', 'business_license', 'voided_check'];
  const requiredCompleted = requiredDocTypes.filter(type => documentGroups[type]?.length > 0).length;
  const requiredProgress = requiredDocTypes.length > 0 
    ? (requiredCompleted / requiredDocTypes.length) * 100 
    : 0;
  
  const getFilteredDocumentTypes = (category: string) => {
    return documentTypeOptions.filter(docType => docType.category === category);
  };

  const DocumentStatus = () => {
    const statusItems = [
      { id: 'required', label: 'Required Documents', count: requiredCompleted, total: requiredDocTypes.length },
      { id: 'business', label: 'Business Documents', count: documentGroups['ein_letter']?.length || 0 + (documentGroups['articles_of_incorporation']?.length || 0), total: 2 },
      { id: 'website', label: 'Website Documents', count: documentGroups['website_terms']?.length || 0 + (documentGroups['privacy_policy']?.length || 0), total: 2 },
      { id: 'identity', label: 'Identity Documents', count: documentGroups['identity_document']?.length || 0, total: 1 }
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statusItems.map(item => (
          <Card key={item.id} className="bg-white">
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <h4 className="text-sm font-medium text-gray-700">{item.label}</h4>
                <div className="mt-2 text-2xl font-bold text-blue-600">{item.count}/{item.total}</div>
                <Progress 
                  value={(item.count / item.total) * 100} 
                  className="h-2 mt-2"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
    
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
                Complete documentation increases your approval chances significantly
              </p>
              
              <div className="mt-4">
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-blue-800">Required Documents</span>
                  <span className="text-blue-800">{requiredCompleted} of {requiredDocTypes.length} Complete</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-in-out" 
                    style={{ width: `${requiredProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <DocumentStatus />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="required">Required</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="website">Website</TabsTrigger>
          <TabsTrigger value="identity">Identity</TabsTrigger>
        </TabsList>
        
        {['required', 'business', 'website', 'identity'].map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Upload {category.charAt(0).toUpperCase() + category.slice(1)} Document</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="documentType">Document Type</Label>
                      <Select 
                        value={documentType} 
                        onValueChange={handleDocumentTypeChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          {getFilteredDocumentTypes(category).map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center">
                                {option.icon}
                                <span className="ml-2">{option.label}</span>
                              </div>
                            </SelectItem>
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
                          <div className={`flex items-center justify-center w-full h-10 border-2 border-dashed rounded-md ${selectedFile ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'} cursor-pointer transition-colors`}>
                            <div className="flex items-center">
                              <Upload className={`h-4 w-4 ${selectedFile ? 'text-blue-500' : 'text-gray-500'} mr-2`} />
                              <span className={`text-sm ${selectedFile ? 'text-blue-600' : 'text-gray-500'}`}>
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
                      className="bg-blue-600 hover:bg-blue-700"
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
            
            {Object.entries(documentGroups).filter(([type]) => 
              documentTypeOptions.find(opt => opt.value === type)?.category === category
            ).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(documentGroups).map(([type, docs]) => {
                  const docTypeOption = documentTypeOptions.find(opt => opt.value === type);
                  if (docTypeOption?.category !== category) return null;
                  
                  return (
                    <div key={type} className="space-y-4">
                      <div className="flex items-center gap-2">
                        {docTypeOption?.icon}
                        <h3 className="text-lg font-medium capitalize">{type.replace(/_/g, ' ')}</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {docs.map((doc) => (
                          <Card key={doc.id} className="border-green-200 hover:shadow-md transition-shadow">
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
                              
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  Uploaded
                                </Badge>
                                <a
                                  href={`${supabase.storage.from('merchant-documents').getPublicUrl(doc.file_path).data.publicUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  View
                                </a>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Alert>
                <AlertDescription>
                  No {category} documents have been uploaded yet. Upload your first document using the form above.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DocumentsForm;
