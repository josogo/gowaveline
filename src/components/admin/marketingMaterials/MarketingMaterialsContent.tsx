
import React from 'react';
import { motion } from 'framer-motion';
import { MarketingHeader } from './MarketingHeader';
import { MaterialsGrid } from './MaterialsGrid';
import { BusinessCardTemplate } from './BusinessCardTemplate';
import { AgentTips } from './AgentTips';

const MarketingMaterialsContent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <motion.div 
        className="space-y-12 w-full max-w-7xl mx-auto px-6 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <MarketingHeader />
        
        <div className="space-y-16">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#FF9F5A] to-[#0EA5E9] bg-clip-text text-transparent">
                Industry Templates
              </h2>
              <p className="text-[#0EA5E9]/80 text-lg max-w-2xl mx-auto">
                Professional marketing materials tailored for each industry vertical. Download instantly and start closing more deals today.
              </p>
            </div>
            <MaterialsGrid />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#FF9F5A] to-[#0EA5E9] bg-clip-text text-transparent">
                Business Cards
              </h2>
              <p className="text-[#0EA5E9]/80 text-lg max-w-2xl mx-auto">
                Customizable business card templates with consistent WaveLine branding that make a lasting impression.
              </p>
            </div>
            <BusinessCardTemplate />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <AgentTips />
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
};

export default MarketingMaterialsContent;
