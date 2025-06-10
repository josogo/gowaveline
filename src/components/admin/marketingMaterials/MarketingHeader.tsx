
import React from 'react';
import { FileText, Download, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

export const MarketingHeader: React.FC = () => {
  return (
    <motion.div 
      className="py-16 px-6 bg-gradient-to-b from-[#FF9F5A]/5 to-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-400">
              Marketing
            </span>
            <span className="text-[#0EA5E9]"> Materials</span>
          </h1>
          
          <motion.p 
            className="text-xl text-[#0EA5E9]/80 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          >
            Professional templates and tools to help you succeed in the field. 
            Download industry-specific materials, customize business cards, and access expert tips.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-orange-100">
            <FileText className="h-8 w-8 text-[#FF9F5A] flex-shrink-0" />
            <div className="text-left">
              <p className="font-semibold text-[#0EA5E9]">Industry Templates</p>
              <p className="text-[#0EA5E9]/70 text-sm">Tailored for each vertical</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-blue-100">
            <Download className="h-8 w-8 text-[#0EA5E9] flex-shrink-0" />
            <div className="text-left">
              <p className="font-semibold text-[#0EA5E9]">Instant Download</p>
              <p className="text-[#0EA5E9]/70 text-sm">PDF & print ready</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-orange-100">
            <Palette className="h-8 w-8 text-[#FF9F5A] flex-shrink-0" />
            <div className="text-left">
              <p className="font-semibold text-[#0EA5E9]">Brand Consistent</p>
              <p className="text-[#0EA5E9]/70 text-sm">WaveLine styling</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
