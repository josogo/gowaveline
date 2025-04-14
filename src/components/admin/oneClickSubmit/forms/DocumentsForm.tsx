
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, FileCheck, FileMinus, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const DocumentsForm: React.FC = () => {
  // Mock document status for demo purposes
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Articles of Incorporation', required: true, uploaded: true },
    { id: 2, name: 'Business License', required: true, uploaded: false },
    { id: 3, name: 'Voided Check', required: true, uploaded: true },
    { id: 4, name: 'Processing Statements (3 months)', required: true, uploaded: false },
    { id: 5, name: 'Bank Statements (3 months)', required: true, uploaded: false },
    { id: 6, name: 'Certificate of Good Standing', required: false, uploaded: false },
    { id: 7, name: 'EIN Letter', required: true, uploaded: true },
    { id: 8, name: 'Website Terms & Conditions', required: true, uploaded: true },
    { id: 9, name: 'Privacy Policy', required: true, uploaded: true },
    { id: 10, name: 'Product Images', required: false, uploaded: false },
    { id: 11, name: 'Marketing Materials', required: false, uploaded: false },
    { id: 12, name: 'Previous Merchant Applications', required: false, uploaded: false },
  ]);
  
  const uploadDocument = (id: number) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, uploaded: true } : doc
    ));
  };
  
  const removeDocument = (id: number) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, uploaded: false } : doc
    ));
  };
  
  const requiredDocuments = documents.filter(doc => doc.required);
  const optionalDocuments = documents.filter(doc => !doc.required);
  
  const uploadedRequiredCount = requiredDocuments.filter(doc => doc.uploaded).length;
  const requiredProgress = (uploadedRequiredCount / requiredDocuments.length) * 100;
  
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
                  <span className="text-blue-800">{uploadedRequiredCount} of {requiredDocuments.length} Complete</span>
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
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Required Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requiredDocuments.map((doc) => (
              <Card key={doc.id} className={doc.uploaded ? "border-green-200" : "border-gray-200"}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    {doc.uploaded ? (
                      <div className="rounded-full bg-green-100 p-2 mr-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    ) : (
                      <div className="rounded-full bg-gray-100 p-2 mr-3">
                        <Upload className="h-5 w-5 text-gray-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.uploaded ? "Uploaded successfully" : "Required for submission"}
                      </p>
                    </div>
                  </div>
                  
                  {doc.uploaded ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeDocument(doc.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <FileMinus className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => uploadDocument(doc.id)}
                      className="bg-blue-600"
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Upload
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Optional Documents</h3>
          <p className="text-sm text-muted-foreground mb-4">
            These documents are not required but can improve your application
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {optionalDocuments.map((doc) => (
              <Card key={doc.id} className={doc.uploaded ? "border-green-200" : "border-gray-200"}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    {doc.uploaded ? (
                      <div className="rounded-full bg-green-100 p-2 mr-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    ) : (
                      <div className="rounded-full bg-gray-100 p-2 mr-3">
                        <Upload className="h-5 w-5 text-gray-600" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{doc.name}</p>
                        <Badge variant="outline" className="text-xs">Optional</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {doc.uploaded ? "Uploaded successfully" : "May improve approval chances"}
                      </p>
                    </div>
                  </div>
                  
                  {doc.uploaded ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeDocument(doc.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <FileMinus className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      size="sm" 
                      onClick={() => uploadDocument(doc.id)}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Upload
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsForm;
