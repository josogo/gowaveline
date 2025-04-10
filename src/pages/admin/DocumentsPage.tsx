
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  DocumentsHeader,
  DocumentsList,
  DocumentUploadDialog,
  DocumentViewDialog,
  DocumentEditDialog,
  DocumentFillDialog,
  PreAppGenerationDialog,
  DocumentItem,
  DocumentDownloadSection,
} from '@/components/admin/documents';
import { checkUserIsAdmin, fetchDocuments, deleteDocument } from '@/components/admin/documents/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DocumentsPage = () => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [fillDialogOpen, setFillDialogOpen] = useState(false);
  const [preAppDialogOpen, setPreAppDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('modern');
  
  const queryClient = useQueryClient();
  
  // Check if the current user is an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const isUserAdmin = await checkUserIsAdmin(session.user.id);
          setIsAdmin(isUserAdmin);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };
    
    checkAdminStatus();
  }, []);
  
  // Fetch documents
  const { data: documents, isLoading, error } = useQuery({
    queryKey: ['documents'],
    queryFn: fetchDocuments
  });
  
  // Log any errors
  React.useEffect(() => {
    if (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    }
  }, [error]);
  
  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting document:', error);
      toast.error(`Failed to delete document: ${error.message}`);
    },
  });
  
  // Handle document deletion
  const handleDeleteDocument = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error: any) {
        console.error('Error deleting document:', error);
      }
    }
  };
  
  // Handle view document
  const handleViewDocument = (document: DocumentItem) => {
    setSelectedDocument(document);
    setViewDialogOpen(true);
  };
  
  // Handle edit document
  const handleEditDocument = (document: DocumentItem) => {
    setSelectedDocument(document);
    setEditDialogOpen(true);
  };
  
  // Handle fill document
  const handleFillDocument = (document: DocumentItem) => {
    setSelectedDocument(document);
    setFillDialogOpen(true);
  };
  
  // Filter documents
  const filteredDocuments = documents?.filter((doc) => {
    if (filter === 'all') return true;
    if (filter === 'templates') return doc.is_template;
    return doc.document_type === filter;
  }) || [];
  
  // Sort documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sort) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });
  
  // Handle refresh
  const handleRefresh = () => {
    console.log('Refreshing document list');
    queryClient.invalidateQueries({ queryKey: ['documents'] });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 w-full max-w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="modern">Modern View</TabsTrigger>
              <TabsTrigger value="classic">Classic View</TabsTrigger>
            </TabsList>
            
            {activeTab === 'modern' ? (
              <div className="flex gap-2">
                <PreAppGenerationDialog
                  open={preAppDialogOpen}
                  onOpenChange={setPreAppDialogOpen}
                  onSuccess={handleRefresh}
                />
              </div>
            ) : (
              <DocumentsHeader
                onUploadClick={() => setUploadDialogOpen(true)}
                onCreatePreAppClick={() => setPreAppDialogOpen(true)}
                onFilterChange={setFilter}
                onSortChange={setSort}
                currentFilter={filter}
                currentSort={sort}
              />
            )}
          </div>

          <TabsContent value="modern" className="mt-6">
            <DocumentDownloadSection 
              documents={sortedDocuments}
              isAdmin={isAdmin}
              isLoading={isLoading}
              onUploadClick={() => setUploadDialogOpen(true)}
              onView={handleViewDocument}
            />
          </TabsContent>
          
          <TabsContent value="classic">
            <DocumentsList
              documents={sortedDocuments}
              isLoading={isLoading}
              onDelete={handleDeleteDocument}
              onView={handleViewDocument}
              onEdit={handleEditDocument}
              onFill={handleFillDocument}
              isAdmin={isAdmin}
              onUploadClick={() => setUploadDialogOpen(true)}
            />
          </TabsContent>
        </Tabs>
        
        <DocumentUploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          onUploadSuccess={handleRefresh}
        />
        
        <DocumentViewDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          document={selectedDocument}
        />
        
        <DocumentEditDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          document={selectedDocument}
          onUpdateSuccess={handleRefresh}
        />
        
        <DocumentFillDialog
          open={fillDialogOpen}
          onOpenChange={setFillDialogOpen}
          document={selectedDocument}
          onSuccess={handleRefresh}
        />
      </div>
    </AdminLayout>
  );
};

export default DocumentsPage;
