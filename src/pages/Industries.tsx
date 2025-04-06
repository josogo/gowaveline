import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from 'lucide-react';
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
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-teal-50 to-transparent py-12 px-6 text-center">
          <h1 className="text-3xl font-bold mb-4 md:text-[ff9f5a] text-[#ffa05c]">Industries We Serve</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We specialize in payment processing solutions for high-risk and specialized industries.
          </p>
        </div>
        
        <div className="container mx-auto py-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-[#0EA5E9]">{industry.name}</CardTitle>
                  <CardDescription>{industry.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {industry.features.map((feature, i) => <li key={i} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-[#0EA5E9] mr-2 mt-0.5" />
                        <span>{feature}</span>
                      </li>)}
                  </ul>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};
export default Industries;