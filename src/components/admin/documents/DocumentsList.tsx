
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, FileText, FileUp } from 'lucide-react';
import { DocumentCard } from './DocumentCard';
import { DocumentItem } from './types';
import { motion } from 'framer-motion';

interface DocumentsListProps {
  documents: DocumentItem[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onView: (document: DocumentItem) => void;
  onEdit: (document: DocumentItem) => void;
  onFill: (document: DocumentItem) => void;
  onUploadClick: () => void;
  isAdmin: boolean;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  isLoading,
  onDelete,
  onView,
  onEdit,
  onFill,
  onUploadClick,
  isAdmin
}) => {
  // Define standard document types
  const standardDocs = [
    {
      id: "standard-nda",
      name: "Non-Disclosure Agreement (NDA)",
      description: "Standard Non-Disclosure Agreement for merchant and agent relationships",
      document_type: "nda",
      is_template: true,
      file_path: "templates/nda.pdf",
      file_type: "application/pdf",
      created_at: new Date().toISOString(),
      isStandard: true
    },
    {
      id: "standard-agent-agreement",
      name: "Agent Agreement",
      description: "Standard Agent Agreement for new relationships",
      document_type: "agreement",
      is_template: true,
      file_path: "templates/agent-agreement.pdf",
      file_type: "application/pdf",
      created_at: new Date().toISOString(),
      isStandard: true
    }
  ];
  
  // Combine standard docs with uploaded docs
  const allDocuments = [...standardDocs, ...documents];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-[#0EA5E9]" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  if (allDocuments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-[#0EA5E9]/10 to-[#FF9F5A]/5 rounded-2xl p-10 text-center">
          <FileUp className="h-12 w-12 text-[#0EA5E9] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#0EA5E9]">No documents yet</h3>
          <p className="text-[#0EA5E9]/80 mt-2 mb-6">
            Upload document templates to generate contracts and agreements
          </p>
          <Button 
            onClick={onUploadClick}
            className="bg-gradient-to-r from-[#FF9F5A] to-[#FF7F37] hover:from-[#FF7F37] hover:to-[#FF9F5A] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </motion.div>
    );
  }

  // Group documents by type
  const groupedDocuments = allDocuments.reduce((acc, doc) => {
    const type = doc.document_type || 'other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(doc);
    return acc;
  }, {} as Record<string, DocumentItem[]>);

  // Display order for document types
  const typeOrder = ['nda', 'agreement', 'contract', 'template', 'other'];

  // Sort document types
  const sortedTypes = Object.keys(groupedDocuments).sort(
    (a, b) => typeOrder.indexOf(a) - typeOrder.indexOf(b)
  );

  return (
    <motion.div 
      className="space-y-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {sortedTypes.map((type) => (
        <motion.div key={type} className="space-y-4" variants={itemVariants}>
          <h3 className="font-semibold text-xl text-[#0EA5E9] capitalize">
            {type === 'nda' ? 'Non-Disclosure Agreements' :
             type === 'contract' ? 'Contracts' :
             type === 'agreement' ? 'Agent Agreements' :
             type === 'template' ? 'Templates' : 
             'Other Documents'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {groupedDocuments[type].map((document, index) => (
              <motion.div
                key={document.id}
                variants={itemVariants}
                custom={index}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <DocumentCard
                  document={document}
                  onDelete={document.isStandard ? undefined : () => onDelete(document.id)}
                  onView={() => onView(document)}
                  onEdit={document.isStandard ? undefined : () => onEdit(document)}
                  onFill={document.is_template ? () => onFill(document) : undefined}
                  isAdmin={isAdmin}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
