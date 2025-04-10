
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Shield, Database, DollarSign, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const BenefitsSection = () => {
  const navigate = useNavigate();
  
  const benefits = [
    {
      title: "Industry Expertise",
      description: "Our team has decades of combined experience working with businesses in high-risk verticals. We understand your unique challenges.",
      icon: <Shield className="h-8 w-8 text-[#FF9F5A]" />
    },
    {
      title: "Multiple Banking Relationships",
      description: "We maintain strong partnerships with domestic and offshore banks that specialize in high-risk merchant accounts.",
      icon: <Database className="h-8 w-8 text-[#0EA5E9]" />
    },
    {
      title: "Competitive Rates",
      description: "We work to secure the most favorable terms possible, even for businesses in challenging industries.",
      icon: <DollarSign className="h-8 w-8 text-[#FF9F5A]" />
    },
    {
      title: "Chargeback Protection",
      description: "Our solutions include advanced fraud detection and chargeback mitigation tools specifically designed for high-risk businesses.",
      icon: <AlertCircle className="h-8 w-8 text-[#0EA5E9]" />
    }
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <div className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#0EA5E9] to-[#FF9F5A] bg-clip-text text-transparent">
            Why Choose Waveline for High-Risk Processing?
          </h2>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              variants={itemVariants}
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold ml-4 text-[#0EA5E9]">{benefit.title}</h3>
              </div>
              <p className="text-[#0EA5E9]/80 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-[#0EA5E9] to-[#0EA5E9]/80 hover:from-[#0EA5E9]/90 hover:to-[#0EA5E9] text-white px-8 py-6 text-lg font-medium rounded-xl shadow-lg transform transition-transform hover:scale-105"
          >
            Analyze Your Statement
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default BenefitsSection;
