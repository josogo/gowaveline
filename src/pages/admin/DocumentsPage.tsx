
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
  Document,
} from '@/components/admin/documents';
import { checkUserIsAdmin, fetchDocuments, deleteDocument } from '@/components/admin/documents/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const DocumentsPage = () => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [fillDialogOpen, setFillDialogOpen] = useState(false);
  const [preAppDialogOpen, setPreAppDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [isAdmin, setIsAdmin] = useState(false);
  
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
  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: fetchDocuments
  });
  
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
        // First get the document to get the file path
        const doc = documents?.find((d) => d.id === id);
        if (!doc) return;
        
        // Delete from storage first
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([doc.file_path]);
        
        if (storageError) throw storageError;
        
        // Then delete database record
        await deleteMutation.mutateAsync(id);
      } catch (error: any) {
        console.error('Error deleting document:', error);
        toast.error(`Failed to delete document: ${error.message}`);
      }
    }
  };
  
  // Handle view document
  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setViewDialogOpen(true);
  };
  
  // Handle edit document
  const handleEditDocument = (document: Document) => {
    setSelectedDocument(document);
    setEditDialogOpen(true);
  };
  
  // Handle fill document
  const handleFillDocument = (document: Document) => {
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
    queryClient.invalidateQueries({ queryKey: ['documents'] });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <DocumentsHeader
          onUploadClick={() => setUploadDialogOpen(true)}
          onCreatePreAppClick={() => setPreAppDialogOpen(true)}
          onFilterChange={setFilter}
          onSortChange={setSort}
          currentFilter={filter}
          currentSort={sort}
        />
        
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
        
        <PreAppGenerationDialog
          open={preAppDialogOpen}
          onOpenChange={setPreAppDialogOpen}
          onSuccess={handleRefresh}
        />
      </div>
    </AdminLayout>
  );
};

export default DocumentsPage;
