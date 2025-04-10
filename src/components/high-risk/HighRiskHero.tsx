
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HighRiskHero = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-[#FF9F5A]/10 to-white py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-[#FF9F5A] via-[#FF7F37] to-[#0EA5E9] bg-clip-text text-transparent">
            High Risk Payment Processing Solutions
          </h1>
          
          <motion.p 
            className="text-xl text-[#0EA5E9] mb-10 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          >
            When traditional payment processors say "no," Waveline says "let's find a way." 
            We specialize in providing reliable merchant services to businesses in high-risk industries.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
          >
            <Button 
              onClick={() => navigate('/')}
              className="px-6 py-3 text-white font-semibold text-lg rounded-xl bg-gradient-to-r from-[#FF9F5A] to-[#FF7F37] hover:from-[#FF7F37] hover:to-[#FF9F5A] shadow-lg transform transition-transform hover:scale-105"
            >
              Analyze Statement
            </Button>
            <Button 
              onClick={() => navigate('/contact')}
              variant="outline" 
              className="px-6 py-3 border-[#0EA5E9] text-[#0EA5E9] font-semibold text-lg rounded-xl hover:bg-[#0EA5E9]/10 transition-colors"
            >
              Contact Us
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HighRiskHero;
