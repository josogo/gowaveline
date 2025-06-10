
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Leaf, Shield, Target, Zap, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

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
  ],
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
  const [downloadedItems, setDownloadedItems] = useState<Set<string>>(new Set());

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

      // Mark as downloaded
      setDownloadedItems(prev => new Set(prev).add(materialType));
      toast.success('PDF downloaded successfully!', {
        description: `${materialContents[materialType as keyof typeof materialContents].title} is ready to use.`
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF', {
        description: 'Please try again in a moment.'
      });
    } finally {
      setDownloading(null);
    }
  };

  const materials = [
    {
      id: 'general',
      title: 'General High-Risk Services',
      description: 'Comprehensive overview of our high-risk merchant services',
      icon: Shield,
      gradient: 'from-orange-500 to-orange-400',
      iconColor: 'text-orange-500',
    },
    {
      id: 'cbd',
      title: 'CBD Industry Solutions',
      description: 'Specialized payment processing for hemp and CBD merchants',
      icon: Leaf,
      gradient: 'from-green-500 to-green-400',
      iconColor: 'text-green-500',
    },
    {
      id: 'adult',
      title: 'Adult Entertainment',
      description: 'Discreet and reliable processing for adult businesses',
      icon: Target,
      gradient: 'from-purple-500 to-purple-400',
      iconColor: 'text-purple-500',
    },
    {
      id: 'firearms',
      title: 'Firearms & Ammunition',
      description: 'Second Amendment-friendly payment solutions',
      icon: Shield,
      gradient: 'from-red-500 to-red-400',
      iconColor: 'text-red-500',
    },
    {
      id: 'vape',
      title: 'Vape & E-Cigarettes',
      description: 'Compliant processing solutions for vaping industry',
      icon: Zap,
      gradient: 'from-teal-500 to-teal-400',
      iconColor: 'text-teal-500',
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
    }),
    hover: {
      y: -4,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Simple Stats Bar */}
      <motion.div 
        className="mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#0EA5E9]">{materials.length}</div>
            <div className="text-sm text-gray-600">Templates</div>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#FF9F5A]">{downloadedItems.size}</div>
            <div className="text-sm text-gray-600">Downloaded</div>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#0EA5E9]" />
            <span className="text-sm text-gray-600">PDF Ready</span>
          </div>
        </div>
      </motion.div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
        {materials.map((material, index) => {
          const IconComponent = material.icon;
          const isDownloading = downloading === material.id;
          const isDownloaded = downloadedItems.has(material.id);
          
          return (
            <motion.div
              key={material.id}
              custom={index}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={cardVariants}
            >
              <Card className="bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 h-full flex flex-col hover:shadow-lg relative overflow-hidden">
                {/* Download Status */}
                <AnimatePresence>
                  {isDownloaded && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute top-4 right-4 z-10"
                    >
                      <div className="bg-green-500 text-white rounded-full p-1.5">
                        <CheckCircle className="h-3 w-3" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <CardHeader className="pb-4">
                  <div className="mb-4">
                    <IconComponent className={`h-10 w-10 ${material.iconColor}`} />
                  </div>
                  
                  <CardTitle className="text-lg font-semibold mb-2 text-[#0EA5E9] leading-tight">
                    {material.title}
                  </CardTitle>
                  
                  <CardDescription className="text-sm text-gray-600 leading-relaxed">
                    {material.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0 flex-grow flex flex-col">
                  <div className="mt-auto">
                    <Button 
                      onClick={() => handleDownload(material.id)}
                      disabled={isDownloading}
                      className={`w-full bg-gradient-to-r ${material.gradient} hover:opacity-90 text-white font-medium shadow-sm hover:shadow-md transition-all duration-300 border-0`}
                      size="sm"
                    >
                      <AnimatePresence mode="wait">
                        {isDownloading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center"
                          >
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </motion.div>
                        ) : (
                          <motion.div
                            key="download"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Action Section */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold mb-3 text-[#0EA5E9]">Need Custom Materials?</h3>
          <p className="text-gray-600 mb-6">
            We can create custom marketing materials tailored to your specific industry or client needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              className="bg-gradient-to-r from-[#FF9F5A] to-[#FF7F37] hover:from-[#FF7F37] hover:to-[#FF9F5A] text-white shadow-sm"
              size="default"
            >
              Request Custom Materials
            </Button>
            <Button 
              variant="outline"
              className="border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white"
              size="default"
            >
              Schedule Consultation
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
