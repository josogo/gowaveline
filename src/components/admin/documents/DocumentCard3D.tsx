
import React from 'react';
import { motion } from 'framer-motion';
import { DocumentItem } from './types';
import { Download, Eye, FileText, File, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { cn } from '@/lib/utils';

interface DocumentCardProps {
  document: DocumentItem;
  isAdmin: boolean;
  isNew: boolean;
  onDownload: () => void;
  onView: () => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  isAdmin,
  isNew,
  onDownload,
  onView,
}) => {
  const fileExt = document.file_path.split('.').pop()?.toLowerCase();
  
  const getFileIcon = () => {
    switch (fileExt) {
      case 'pdf':
        return <FileText className="h-12 w-12 text-red-500 transition-all group-hover:text-orange-500 group-hover:drop-shadow-[0_0_8px_rgba(255,82,0,0.5)]" />;
      case 'doc':
      case 'docx':
        return <File className="h-12 w-12 text-blue-600 transition-all group-hover:text-orange-500 group-hover:drop-shadow-[0_0_8px_rgba(255,82,0,0.5)]" />;
      default:
        return <FileText className="h-12 w-12 text-teal-500 transition-all group-hover:text-orange-500 group-hover:drop-shadow-[0_0_8px_rgba(255,82,0,0.5)]" />;
    }
  };

  // Determine if this is a template, preapp form, or standard document
  const getDocumentTypeLabel = () => {
    if (document.is_template) {
      return "Template";
    }
    switch (document.document_type) {
      case 'template':
        return "Template";
      case 'contract':
        return "Contract";
      case 'preapp':
        return "Pre-App Form";
      default:
        return "Document";
    }
  };

  // Get badge color based on document type
  const getBadgeColor = () => {
    if (document.is_template) {
      return "bg-amber-100 text-amber-800 border-amber-200";
    }
    switch (document.document_type) {
      case 'template':
        return "bg-blue-100 text-blue-800 border-blue-200";
      case 'contract':
        return "bg-green-100 text-green-800 border-green-200";
      case 'preapp':
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  return (
    <motion.div
      className="group h-full cursor-pointer"
      whileHover={{ scale: 1.03, translateY: -8 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }}
    >
      <div 
        className={cn(
          "relative h-full rounded-xl overflow-hidden bg-gradient-to-br p-6",
          "from-[#FF8A5B] to-[#FF5200]",
          "shadow-md hover:shadow-xl transition-all duration-300",
          "flex flex-col justify-between"
        )}
      >
        {/* Top section with icon and badge */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {getFileIcon()}
            <span className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
              getBadgeColor(),
              "mt-2"
            )}>
              {getDocumentTypeLabel()}
            </span>
            
            {isNew && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                NEW
              </span>
            )}
          </div>
        </div>
        
        {/* Document details */}
        <div className="mt-4">
          <h3 className="text-xl font-bold text-white leading-tight mb-2">
            {document.name}
          </h3>
          
          {document.description && (
            <p className="text-white/80 text-sm line-clamp-2 mb-4">
              {document.description}
            </p>
          )}
          
          {/* Date added with hover */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex items-center text-xs text-white/70 mb-4">
                <Clock className="h-3 w-3 mr-1" />
                Added {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto">
              <p className="text-sm">
                {new Date(document.created_at).toLocaleDateString()} at{' '}
                {new Date(document.created_at).toLocaleTimeString()}
              </p>
            </HoverCardContent>
          </HoverCard>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-between mt-auto">
          <motion.button
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 
                     text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
          >
            <Eye className="h-4 w-4" />
            View
          </motion.button>
          
          <motion.button
            className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 
                     text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
          >
            <Download className="h-4 w-4" />
            Download
          </motion.button>
        </div>
        
        {/* 3D glossy reflection */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />
      </div>
    </motion.div>
  );
};
