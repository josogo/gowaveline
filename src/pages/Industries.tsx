
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const industries = [{
  name: "Auto Dealers",
  description: "Payment processing solutions for car dealerships and automotive businesses",
  features: ["Integrated with DMS systems", "Secure payment solutions", "Customer financing options"]
}, {
  name: "CBD / Hemp",
  description: "Compliant payment solutions for CBD and hemp product merchants",
  features: ["High-risk account specialists", "Compliant processing", "Recurring billing options"]
}, {
  name: "Tobacco & Vape",
  description: "Specialized payment processing for tobacco and vape retailers",
  features: ["Age verification integration", "High-risk account management", "Stable processing solutions"]
}, {
  name: "Firearms & Ammunition",
  description: "Secure and compliant payment solutions for firearm dealers",
  features: ["FFL-friendly processing", "Background check integration", "Regulatory compliance support"]
}, {
  name: "Gaming & Gambling",
  description: "Payment solutions for online gaming and gambling platforms",
  features: ["Regulatory compliance", "Anti-fraud measures", "Multi-currency support"]
}, {
  name: "Cryptocurrency",
  description: "Innovative payment solutions for crypto businesses and exchanges",
  features: ["Crypto-to-fiat processing", "Low chargeback options", "International transactions", "Regulatory compliance expertise"]
}, {
  name: "AI & Technology",
  description: "Payment processing for cutting-edge AI and tech companies",
  features: ["Subscription management", "Fast integration with SaaS platforms", "Global processing"]
}, {
  name: "Direct Marketing",
  description: "Reliable processing for direct marketing businesses",
  features: ["Recurring billing solutions", "CRM integrations", "Chargeback prevention tools"]
}, {
  name: "Adult Services",
  description: "Discreet and reliable payment processing for adult industry",
  features: ["High-risk expertise", "Privacy-focused solutions", "Stable processing"]
}, {
  name: "Nutraceuticals",
  description: "Payment solutions for supplement and nutraceutical companies",
  features: ["Subscription management", "High-volume processing", "Chargeback protection"]
}, {
  name: "Extended Warranty",
  description: "Processing solutions for extended warranty service providers",
  features: ["Recurring billing", "Automated payment handling", "Customer retention tools"]
}, {
  name: "Financial Aid Consulting",
  description: "Secure payment options for financial advisory services",
  features: ["Compliance with regulations", "Subscription models", "Secure client payment portals"]
}, {
  name: "Fine & Fashion Jewelry",
  description: "Payment solutions for high-value jewelry retailers",
  features: ["High-ticket transaction processing", "Chargeback protection", "Fraud prevention"]
}, {
  name: "Functional Foods",
  description: "Processing for specialty food and health products",
  features: ["Subscription billing", "Multi-channel integration", "Industry-specific solutions"]
}, {
  name: "Herbal Supplements",
  description: "Payment solutions for herbal product merchants",
  features: ["Regulatory compliance", "Subscription management", "Multi-currency support"]
}, {
  name: "Insurance Brokerage",
  description: "Processing solutions for insurance premium payments",
  features: ["Recurring billing", "Compliance support", "Payment plans integration"]
}, {
  name: "Liquor Sales",
  description: "Age-verified payment processing for alcohol retailers",
  features: ["Age verification", "Regulatory compliance", "Multi-location support"]
}, {
  name: "Magazine Sales",
  description: "Subscription processing for print and digital publications",
  features: ["Recurring billing", "Easy cancellation management", "Multi-platform support"]
}, {
  name: "Match Making Services",
  description: "Payment solutions for dating and matchmaking platforms",
  features: ["Subscription management", "Trial period handling", "Global payment support"]
}, {
  name: "Mobile App Software",
  description: "In-app purchase and subscription processing",
  features: ["API integration", "Recurring billing", "Analytics and metrics"]
}, {
  name: "Mobile Payments",
  description: "Solutions for contactless and mobile payment technologies",
  features: ["NFC integration", "QR code payments", "Cross-platform support"]
}, {
  name: "Multi Level Marketing",
  description: "Processing solutions for MLM and direct sales businesses",
  features: ["Commission distribution", "Multi-tier payment handling", "International support"]
}, {
  name: "Nootropics",
  description: "Payment processing for cognitive enhancement products",
  features: ["High-risk expertise", "Subscription billing", "Regulatory compliance"]
}];

const Industries = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section - Styled like HighRiskHero */}
        <div className="bg-gradient-to-b from-[#FF9F5A]/10 to-white py-20 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-8">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-400">
                  Industries
                </span>
                <span className="text-[#0EA5E9]"> We Serve</span>
              </h1>
              
              <motion.p 
                className="text-xl text-[#0EA5E9] mb-10 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
              >
                We specialize in payment processing solutions for high-risk and specialized industries
                that need reliable, secure, and compliant merchant services.
              </motion.p>
            </motion.div>
          </div>
        </div>
        
        {/* Industries Grid with Card Animation */}
        <div className="py-16 px-6 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industries.map((industry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow border border-gray-100">
                    <CardHeader>
                      <CardTitle className="text-[#0EA5E9]">{industry.name}</CardTitle>
                      <CardDescription>{industry.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {industry.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-[#FF9F5A] mr-2 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Contact CTA Section - Similar to the "Don't See Your Industry" section in IndustriesSection */}
        <div className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="p-8 bg-gradient-to-r from-[#0EA5E9]/10 to-[#FF9F5A]/5 rounded-2xl text-center shadow-sm">
              <h3 className="text-2xl font-bold mb-4 text-[#0EA5E9]">Don't See Your Industry?</h3>
              <p className="text-[#0EA5E9]/80 mb-6 max-w-2xl mx-auto">
                We work with many other specialized industries not listed here. 
                If you're struggling to find payment processing for your business, we likely have a solution.
              </p>
              <Button 
                onClick={() => navigate('/contact')}
                className="bg-gradient-to-r from-[#0EA5E9] to-[#FF9F5A] hover:from-[#0EA5E9]/90 hover:to-[#FF9F5A]/90 text-white shadow-md transform transition-transform hover:scale-105"
              >
                Discuss Your Needs
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Industries;
