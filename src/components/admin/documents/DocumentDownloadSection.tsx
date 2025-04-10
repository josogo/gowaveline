
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DocumentCard3D } from './DocumentCard3D';
import { DocumentItem } from './types';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

interface DocumentDownloadSectionProps {
  documents: DocumentItem[];
  isAdmin: boolean;
  isLoading: boolean;
  onUploadClick: () => void;
  onView: (document: DocumentItem) => void;
}

export const DocumentDownloadSection: React.FC<DocumentDownloadSectionProps> = ({
  documents,
  isAdmin,
  isLoading,
  onUploadClick,
  onView,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDocs, setFilteredDocs] = useState<DocumentItem[]>(documents);

  // Filter documents when search query or documents change
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDocs(documents);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = documents.filter(
      doc => doc.name.toLowerCase().includes(query) || 
             (doc.description && doc.description.toLowerCase().includes(query))
    );
    setFilteredDocs(filtered);
  }, [searchQuery, documents]);

  const handleDownload = async (document: DocumentItem) => {
    try {
      // Generate signed URL for secure download
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.file_path, 60);
      
      if (error) throw error;
      
      // Create a temporary anchor and trigger download
      const link = window.document.createElement('a');
      link.href = data.signedUrl;
      link.download = document.name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  // Animation variants for staggered card appearance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 80,
        damping: 15
      }
    }
  };

  return (
    <div className="space-y-6 mb-12">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Document Downloads</h2>
          <p className="text-gray-500">Access important documents and forms</p>
        </div>
        
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search documents..."
              className="pl-9 w-full sm:w-[240px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {isAdmin && (
            <Button onClick={onUploadClick} className="whitespace-nowrap">
              <Plus className="mr-2 h-4 w-4" />
              Add Document
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-gray-100 animate-pulse"></div>
          ))}
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <p className="text-gray-500">No documents found</p>
          {searchQuery && (
            <Button 
              variant="link" 
              onClick={() => setSearchQuery('')}
              className="mt-2"
            >
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredDocs.map((doc) => (
            <motion.div key={doc.id} variants={itemVariants}>
              <DocumentCard3D 
                document={doc}
                isAdmin={isAdmin}
                onDownload={() => handleDownload(doc)}
                onView={() => onView(doc)}
                isNew={
                  // Mark as new if document was added in the last 7 days
                  new Date(doc.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
                }
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
