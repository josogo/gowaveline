
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
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <MarketingHeader />
        
        <div className="space-y-20">
          {/* Industry Templates Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="text-center mb-12 px-6">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#FF9F5A] to-[#0EA5E9] bg-clip-text text-transparent">
                Industry Templates
              </h2>
              <p className="text-[#0EA5E9]/80 text-lg max-w-2xl mx-auto leading-relaxed">
                Professional marketing materials tailored for each industry vertical. Download instantly and start closing more deals today.
              </p>
            </div>
            <MaterialsGrid />
          </motion.section>

          {/* Business Cards Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="px-6"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#FF9F5A] to-[#0EA5E9] bg-clip-text text-transparent">
                Business Cards
              </h2>
              <p className="text-[#0EA5E9]/80 text-lg max-w-2xl mx-auto leading-relaxed">
                Customizable business card templates with consistent WaveLine branding that make a lasting impression.
              </p>
            </div>
            <div className="max-w-7xl mx-auto">
              <BusinessCardTemplate />
            </div>
          </motion.section>

          {/* Agent Tips Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="px-6 pb-16"
          >
            <div className="max-w-7xl mx-auto">
              <AgentTips />
            </div>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
};

export default MarketingMaterialsContent;
