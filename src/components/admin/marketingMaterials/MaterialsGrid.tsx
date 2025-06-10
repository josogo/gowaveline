import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Leaf, Shield, Target, Zap, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface MaterialData {
  materialType: string;
  content: {
    title: string;
    subtitle: string;
    challenges: string[];
    solutions: string[];
    features?: string[];
    industries?: string[];
  };
  companyInfo: {
    name: string;
    tagline: string;
    website: string;
    phone: string;
    email: string;
  };
}

const materialContents = {
  general: {
    title: "High-Risk Merchant Services",
    subtitle: "Your Partner in Payment Processing Success",
    challenges: [
      "Traditional processors reject high-risk industries",
      "Mainstream providers like Stripe and PayPal often prohibit high-risk categories",
      "Sudden account closures leave merchants stranded",
      "Higher fees and strict terms from unsuitable processors"
    ],
    solutions: [
      "Specialized high-risk underwriting expertise",
      "Network of 20+ acquiring banking partners",
      "99% approval rate with 24-hour turnaround",
      "Stable processing without surprise holds",
      "Transparent, competitive pricing with no hidden fees",
      "Dedicated account management and support"
    ],
    industries: ["Adult Entertainment", "Firearms", "CBD", "Vape/E-cigarettes", "Online Gaming", "Tobacco"]
  },
  cbd: {
    title: "CBD Payment Processing Solutions",
    subtitle: "Compliant, Stable Processing for Hemp & CBD Merchants",
    challenges: [
      "Regulatory complexity despite 2018 Farm Bill legalization",
      "PayPal, Stripe, and Square prohibit CBD transactions",
      "Frequent account freezes and sudden shutdowns",
      "Limited payment options for legitimate CBD businesses"
    ],
    solutions: [
      "Specialized CBD compliance expertise",
      "Banking partners comfortable with hemp products",
      "No-freeze guarantee for stable cash flow",
      "Support for subscriptions and high-ticket sales",
      "Discreet billing descriptors available",
      "Fast approval process for CBD merchants"
    ],
    features: ["Age Verification", "State Compliance", "ACH Processing", "Subscription Billing"]
  },
  adult: {
    title: "Adult Entertainment Payment Solutions",
    subtitle: "Discreet, Reliable Processing for Adult Businesses",
    challenges: [
      "Mainstream processors avoid adult entertainment",
      "High chargeback rates in the industry",
      "Need for discrete billing descriptors",
      "Age verification and compliance requirements"
    ],
    solutions: [
      "Non-judgmental, professional service approach",
      "Discreet billing and privacy protection",
      "Subscription and membership billing support",
      "Global payments and multi-currency processing",
      "High approval rates with specialized underwriting",
      "24/7 dedicated account management"
    ],
    features: ["Discrete Billing", "Global Processing", "Subscription Support", "Privacy Protection"]
  },
  firearms: {
    title: "Firearms & Ammunition Processing",
    subtitle: "Second Amendment-Friendly Payment Solutions",
    challenges: [
      "Many banks avoid firearms industry altogether",
      "Complex federal and state regulations",
      "High-ticket transactions require specialized handling",
      "FFL compliance and background check requirements"
    ],
    solutions: [
      "Gun-friendly banking partnerships",
      "ATF and compliance expertise",
      "Robust processing without arbitrary limits",
      "Chargeback mitigation for high-value items",
      "POS integration for gun shows and retail",
      "Reliable service without reputation concerns"
    ],
    features: ["FFL Compliance", "High-Ticket Support", "Gun Show POS", "Regulation Expertise"]
  },
  vape: {
    title: "Vape & E-Cigarette Processing",
    subtitle: "Specialized Payment Solutions for Vaping Industry",
    challenges: [
      "Health concerns create processing challenges",
      "Evolving regulations and uncertain legal status",
      "High chargeback rates from customer disputes",
      "Age verification and shipping restrictions"
    ],
    solutions: [
      "Vape-friendly banking relationships",
      "Fast setup under 48 hours",
      "Complete payment options including ACH",
      "Chargeback prevention and fraud tools",
      "Age verification integration",
      "Mobile and POS options for retail"
    ],
    features: ["Age Verification", "Fraud Prevention", "Mobile Payments", "Compliance Tools"]
  }
};

const companyInfo = {
  name: "WaveLine",
  tagline: "Your Partner in High-Risk Merchant Services",
  website: "gowaveline.com",
  phone: "818-264-6859",
  email: "info@gowaveline.com"
};

export const MaterialsGrid: React.FC = () => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (materialType: string) => {
    setDownloading(materialType);
    
    try {
      const materialData: MaterialData = {
        materialType,
        content: materialContents[materialType as keyof typeof materialContents],
        companyInfo
      };

      const response = await fetch('https://rqwrvkkfixrogxogunsk.supabase.co/functions/v1/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3J2a2tmaXhyb2d4b2d1bnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjMxMjEsImV4cCI6MjA1OTI5OTEyMX0.nESe15lNwkqji77TNpbWGFGo-uHkKt73AZFfBR6oMRY'}`,
        },
        body: JSON.stringify({
          type: 'marketing-material',
          data: materialData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${materialType}-merchant-services.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  const materials = [
    {
      id: 'general',
      title: 'General High-Risk Services',
      description: 'Comprehensive overview of our high-risk merchant services for all industries',
      icon: Shield,
      gradient: 'from-orange-500 to-orange-400',
      bgGradient: 'from-orange-50 to-orange-100',
      iconColor: 'text-orange-500'
    },
    {
      id: 'cbd',
      title: 'CBD Industry Solutions',
      description: 'Specialized payment processing for hemp and CBD merchants',
      icon: Leaf,
      gradient: 'from-green-500 to-green-400',
      bgGradient: 'from-green-50 to-green-100',
      iconColor: 'text-green-500'
    },
    {
      id: 'adult',
      title: 'Adult Entertainment',
      description: 'Discreet and reliable processing for adult industry businesses',
      icon: Target,
      gradient: 'from-purple-500 to-purple-400',
      bgGradient: 'from-purple-50 to-purple-100',
      iconColor: 'text-purple-500'
    },
    {
      id: 'firearms',
      title: 'Firearms & Ammunition',
      description: 'Second Amendment-friendly payment solutions for gun retailers',
      icon: Shield,
      gradient: 'from-red-500 to-red-400',
      bgGradient: 'from-red-50 to-red-100',
      iconColor: 'text-red-500'
    },
    {
      id: 'vape',
      title: 'Vape & E-Cigarettes',
      description: 'Compliant processing solutions for vaping industry merchants',
      icon: Zap,
      gradient: 'from-teal-500 to-teal-400',
      bgGradient: 'from-teal-50 to-teal-100',
      iconColor: 'text-teal-500'
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="py-8 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {materials.map((material, index) => {
          const IconComponent = material.icon;
          const isDownloading = downloading === material.id;
          
          return (
            <motion.div
              key={material.id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Card className="bg-white rounded-2xl shadow-md border border-gray-100 transition-all duration-300 cursor-pointer h-full flex flex-col transform hover:-translate-y-1 hover:shadow-xl">
                <CardHeader className="pb-4">
                  <div className="mb-4 transition-transform duration-300 hover:scale-110">
                    <IconComponent className={`h-12 w-12 ${material.iconColor}`} />
                  </div>
                  
                  <CardTitle className="text-xl font-bold mb-3 text-[#0EA5E9] transition-colors duration-300">
                    {material.title}
                  </CardTitle>
                  
                  <CardDescription className="text-sm text-[#0EA5E9]/80 leading-relaxed">
                    {material.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4 pt-0 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <FileText className="h-4 w-4 text-muted-foreground/70" />
                    <span>Professional PDF • One-page overview • Print ready</span>
                  </div>
                  
                  <div className="mt-auto">
                    <Button 
                      onClick={() => handleDownload(material.id)}
                      disabled={isDownloading}
                      className={`w-full bg-gradient-to-r ${material.gradient} hover:opacity-90 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none disabled:hover:scale-100 border-0`}
                      size="default"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download Template
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Call-to-Action Section */}
      <div className="mt-16 p-8 bg-gradient-to-r from-[#0EA5E9]/10 to-[#FF9F5A]/5 rounded-2xl text-center shadow-sm">
        <h3 className="text-2xl font-bold mb-4 text-[#0EA5E9]">Need Custom Materials?</h3>
        <p className="text-[#0EA5E9]/80 mb-6 max-w-2xl mx-auto">
          We can create custom marketing materials tailored to your specific industry or client needs. 
          Contact us to discuss your requirements.
        </p>
        <Button 
          className="bg-gradient-to-r from-[#FF9F5A] to-[#FF7F37] hover:from-[#FF7F37] hover:to-[#FF9F5A] text-white shadow-md transform transition-transform hover:scale-105"
        >
          Request Custom Materials
        </Button>
      </div>
    </div>
  );
};
