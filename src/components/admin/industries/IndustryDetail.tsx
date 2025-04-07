
import React, { useState, useEffect } from 'react';
import { Industry, IndustryDocument, Lead, fetchIndustryById, fetchIndustryDocuments, fetchLeads, deleteIndustryDocument } from './types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Upload, FileText, Image, File } from 'lucide-react';
import { toast } from 'sonner';
import { DocumentsList } from './DocumentsList';
import { FileUploader } from './FileUploader';
import { GeneratePdfDialog } from './GeneratePdfDialog';
import { supabase } from '@/integrations/supabase/client';

interface IndustryDetailProps {
  industryId: string;
}

export const IndustryDetail: React.FC<IndustryDetailProps> = ({ industryId }) => {
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [documents, setDocuments] = useState<IndustryDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('documents');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'template' | 'supporting' | 'logo'>('supporting');
  const [generatePdfOpen, setGeneratePdfOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    if (industryId) {
      fetchIndustryDetails();
      fetchIndustryDocuments();
      fetchIndustryLeads();
    }
  }, [industryId]);

  const fetchIndustryDetails = async () => {
    try {
      const data = await fetchIndustryById(industryId);
      if (data) {
        setIndustry(data);
      }
    } catch (error) {
      console.error('Error fetching industry details:', error);
      toast.error('Failed to load industry details');
    }
  };

  const fetchIndustryDocuments = async () => {
    setLoading(true);
    try {
      const data = await fetchIndustryDocuments(industryId);
      if (data) {
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching industry documents:', error);
      toast.error('Failed to load industry documents');
    } finally {
      setLoading(false);
    }
  };

  const fetchIndustryLeads = async () => {
    try {
      const data = await fetchLeads();
      if (data) {
        setLeads(data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      // Find the document to get its file path
      const docToDelete = documents.find(doc => doc.id === documentId);
      if (!docToDelete) throw new Error('Document not found');
      
      // Delete from storage first
      const { error: storageError } = await supabase.storage
        .from('industry-files')
        .remove([docToDelete.file_path]);
        
      if (storageError) throw storageError;
      
      // Then delete from database
      await deleteIndustryDocument(documentId);
      
      // Update local state
      setDocuments(documents.filter(doc => doc.id !== documentId));
      toast.success('Document deleted successfully');
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast.error(error.message || 'Failed to delete document');
    }
  };

  const handleUploadSuccess = () => {
    fetchIndustryDocuments();
    setUploadDialogOpen(false);
    toast.success('Document uploaded successfully');
  };

  const openUploadDialog = (type: 'template' | 'supporting' | 'logo') => {
    setUploadType(type);
    setUploadDialogOpen(true);
  };

  const getDocumentsByType = (type: string) => {
    return documents.filter(doc => doc.file_type === type);
  };

  const hasTemplate = getDocumentsByType('template').length > 0;
  const hasLogo = getDocumentsByType('logo').length > 0;

  if (!industry) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{industry.name}</h1>
            {industry.description && (
              <p className="text-gray-500 mt-1">{industry.description}</p>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setGeneratePdfOpen(true)}
              disabled={!hasTemplate}
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Pre-App PDF
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
        <TabsList className="mb-6">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents">
          <div className="space-y-8">
            {/* Template Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Application Template</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openUploadDialog('template')}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {hasTemplate ? 'Replace Template' : 'Upload Template'}
                </Button>
              </div>
              
              {loading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                </div>
              ) : hasTemplate ? (
                <DocumentsList 
                  documents={getDocumentsByType('template')} 
                  onDelete={handleDeleteDocument}
                />
              ) : (
                <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-1">No application template uploaded</p>
                  <p className="text-sm text-gray-500">
                    Upload a PDF template for this industry's application form
                  </p>
                </div>
              )}
            </div>
            
            {/* Logo Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Company Logo</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openUploadDialog('logo')}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {hasLogo ? 'Replace Logo' : 'Upload Logo'}
                </Button>
              </div>
              
              {loading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                </div>
              ) : hasLogo ? (
                <DocumentsList 
                  documents={getDocumentsByType('logo')} 
                  onDelete={handleDeleteDocument}
                />
              ) : (
                <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <Image className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-1">No logo uploaded</p>
                  <p className="text-sm text-gray-500">
                    Upload a logo to be included on PDF documents
                  </p>
                </div>
              )}
            </div>
            
            {/* Supporting Documents Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Supporting Documents</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openUploadDialog('supporting')}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
              
              {loading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                </div>
              ) : getDocumentsByType('supporting').length > 0 ? (
                <DocumentsList 
                  documents={getDocumentsByType('supporting')} 
                  onDelete={handleDeleteDocument}
                />
              ) : (
                <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <File className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-1">No supporting documents</p>
                  <p className="text-sm text-gray-500">
                    Upload industry-specific guidelines, brochures, or other materials
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-4">Industry Settings</h2>
              <p className="text-gray-500">
                Additional settings for this industry will be available here in the future.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <FileUploader
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        industryId={industryId}
        fileType={uploadType}
        onSuccess={handleUploadSuccess}
      />
      
      <GeneratePdfDialog
        open={generatePdfOpen}
        onOpenChange={setGeneratePdfOpen}
        industry={industry}
        leads={leads}
      />
    </div>
  );
};
