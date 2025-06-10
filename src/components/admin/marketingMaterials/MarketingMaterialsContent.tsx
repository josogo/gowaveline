
import React from 'react';
import { motion } from 'framer-motion';
import { MarketingHeader } from './MarketingHeader';
import { MaterialsGrid } from './MaterialsGrid';
import { BusinessCardTemplate } from './BusinessCardTemplate';
import { AgentTips } from './AgentTips';

const MarketingMaterialsContent = () => {
  return (
    <motion.div 
      className="space-y-8 w-full max-w-full px-6 py-8 bg-gradient-to-br from-background via-background to-muted/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <MarketingHeader />
      
      <div className="grid gap-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Industry Templates</h2>
            <p className="text-muted-foreground">Professional marketing materials tailored for each industry vertical</p>
          </div>
          <MaterialsGrid />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Business Cards</h2>
            <p className="text-muted-foreground">Customizable business card templates with consistent WaveLine branding</p>
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
  );
};

export default MarketingMaterialsContent;
