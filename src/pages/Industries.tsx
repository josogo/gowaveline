
import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from 'lucide-react';

const industries = [
  {
    name: "Auto Dealers",
    description: "Payment processing solutions for car dealerships and automotive businesses",
    features: ["Integrated with DMS systems", "Secure payment solutions", "Customer financing options"]
  },
  {
    name: "CBD / Hemp",
    description: "Compliant payment solutions for CBD and hemp product merchants",
    features: ["High-risk account specialists", "Compliant processing", "Recurring billing options"]
  },
  {
    name: "Tobacco & Vape",
    description: "Specialized payment processing for tobacco and vape retailers",
    features: ["Age verification integration", "High-risk account management", "Stable processing solutions"]
  },
  {
    name: "Firearms & Ammunition",
    description: "Secure and compliant payment solutions for firearm dealers",
    features: ["FFL-friendly processing", "Background check integration", "Regulatory compliance support"]
  },
  {
    name: "Gaming & Gambling",
    description: "Payment solutions for online gaming and gambling platforms",
    features: ["Regulatory compliance", "Anti-fraud measures", "Multi-currency support"]
  },
  {
    name: "Cryptocurrency",
    description: "Innovative payment solutions for crypto businesses",
    features: ["Crypto-to-fiat processing", "Low chargeback options", "International transactions"]
  },
  {
    name: "AI & Technology",
    description: "Payment processing for cutting-edge AI and tech companies",
    features: ["Subscription management", "Fast integration with SaaS platforms", "Global processing"]
  },
  {
    name: "Direct Marketing",
    description: "Reliable processing for direct marketing businesses",
    features: ["Recurring billing solutions", "CRM integrations", "Chargeback prevention tools"]
  },
  {
    name: "Adult Services",
    description: "Discreet and reliable payment processing for adult industry",
    features: ["High-risk expertise", "Privacy-focused solutions", "Stable processing"]
  },
  {
    name: "Nutraceuticals",
    description: "Payment solutions for supplement and nutraceutical companies",
    features: ["Subscription management", "High-volume processing", "Chargeback protection"]
  }
];

const Industries = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-orange-50 to-transparent py-12 px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Industries We Serve</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We specialize in payment processing solutions for high-risk and specialized industries.
          </p>
        </div>
        
        <div className="container mx-auto py-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{industry.name}</CardTitle>
                  <CardDescription>{industry.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {industry.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Industries;
