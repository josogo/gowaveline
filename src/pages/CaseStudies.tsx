
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CaseStudy = {
  title: string;
  shortDescription: string;
  industry: string;
  metrics: {
    label: string;
    value: string;
  };
  fullDescription: {
    challenge: string;
    solution: string;
    results: string;
  };
  gradientFrom: string;
  gradientTo: string;
};

const CaseStudies = () => {
  const navigate = useNavigate();
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const caseStudies: CaseStudy[] = [
    {
      title: "E-Commerce Retailer Saves 23% on Processing",
      shortDescription: "Online retail business with $1.2M in annual volume",
      industry: "E-Commerce",
      metrics: {
        label: "23% Savings",
        value: "$34,500 annual reduction"
      },
      fullDescription: {
        challenge: "A growing online retailer was facing excessive fees with their previous processor. They were being charged high rates for rewards cards and international transactions, which made up a significant portion of their business. Additionally, they were stuck in a long-term contract with early termination fees.",
        solution: "After conducting a detailed analysis of their processing statements, we identified several areas of overcharging. We negotiated a custom pricing model based on their specific card mix and implemented a new payment gateway that optimized routing for the lowest interchange rates. We also covered their early termination fee with their previous processor.",
        results: "The retailer saw immediate savings of 23% on their monthly processing costs, resulting in over $34,500 in annual savings. Additionally, their customers experienced fewer declined transactions due to our improved gateway technology."
      },
      gradientFrom: "from-blue-500",
      gradientTo: "to-blue-400"
    },
    {
      title: "High-Risk CBD Business Gets Approved",
      shortDescription: "CBD manufacturer rejected by 5 other processors",
      industry: "CBD",
      metrics: {
        label: "2.9% Rate",
        value: "Previously denied service"
      },
      fullDescription: {
        challenge: "A CBD manufacturer had been rejected by five different payment processors due to their high-risk classification. They were losing significant online sales and customer trust by having to rely on bank transfers and cryptocurrency payments.",
        solution: "We leveraged our relationships with banks that specialize in CBD businesses and provided comprehensive compliance documentation to secure approval. We implemented a specialized payment gateway with enhanced security features and chargeback prevention tools.",
        results: "The business was approved within 10 days and began processing with stable, reliable payment acceptance. Their conversion rates improved by 32% once customers could pay with credit cards, and they maintained a low chargeback ratio thanks to our prevention tools."
      },
      gradientFrom: "from-orange-400",
      gradientTo: "to-[#0EA5E9]"
    },
    {
      title: "Restaurant Chain Switches POS Systems",
      shortDescription: "5-location restaurant business with outdated POS",
      industry: "Restaurants",
      metrics: {
        label: "15% Savings",
        value: "Improved customer experience"
      },
      fullDescription: {
        challenge: "A restaurant chain with five locations was using outdated POS hardware with expensive monthly fees. Their system frequently crashed during peak hours, causing lost sales and frustrated customers. They were also paying high rates on transactions.",
        solution: "We implemented a modern, integrated POS solution specifically designed for restaurants. The new system included tableside ordering tablets, kitchen display screens, and real-time inventory management. We also negotiated lower processing rates based on their combined volume across all locations.",
        results: "The restaurant chain saved 15% on their monthly payment processing costs while significantly improving operational efficiency. Table turn times decreased by an average of 12 minutes, and they saw a 9% increase in average ticket size due to the improved ordering experience."
      },
      gradientFrom: "from-[#0EA5E9]/70",
      gradientTo: "to-[#0EA5E9]"
    },
    {
      title: "Crypto Exchange Secures Banking",
      shortDescription: "Digital asset platform with compliance challenges",
      industry: "Cryptocurrency",
      metrics: {
        label: "30 Days",
        value: "From application to approval"
      },
      fullDescription: {
        challenge: "A cryptocurrency exchange struggled to find banking solutions due to regulatory concerns. Multiple banks had closed their accounts with little notice, causing disruptions in their ability to serve customers and maintain operations.",
        solution: "We connected them with crypto-friendly banking partners and helped implement enhanced KYC/AML procedures that satisfied regulatory requirements. We also established redundant banking relationships to ensure business continuity.",
        results: "The exchange secured stable banking within 30 days and now maintains multiple banking relationships for redundancy. They were able to expand services and add new fiat on-ramps, increasing their monthly trading volume by 40%."
      },
      gradientFrom: "from-[#0EA5E9]",
      gradientTo: "to-[#0EA5E9]/70"
    },
    {
      title: "Peptide Research Company Maintains Continuity",
      shortDescription: "Research chemical business facing account terminations",
      industry: "Peptides",
      metrics: {
        label: "Zero Downtime",
        value: "Multiple processing options"
      },
      fullDescription: {
        challenge: "A peptide research company was repeatedly getting shut down by payment processors without warning. They would establish a merchant account only to have it terminated within a few months, creating significant disruption to their business and revenue.",
        solution: "We established multiple redundant merchant accounts (MIDs) across different processing partners, creating a robust processing ecosystem. When one processor raised concerns, they could seamlessly switch to another without disruption to their customers.",
        results: "The company has maintained continuous processing capabilities for over 18 months with zero downtime. Their business has grown by 45% during this period due to the stable payment environment and customer confidence."
      },
      gradientFrom: "from-purple-500",
      gradientTo: "to-purple-400"
    },
    {
      title: "Auto Dealership Eliminates Hidden Fees",
      shortDescription: "Multi-location dealership switching to dual pricing",
      industry: "Automotive",
      metrics: {
        label: "18% Savings",
        value: "$27,400 annual reduction"
      },
      fullDescription: {
        challenge: "A multi-location automotive dealership was being charged excessive fees by their processor, including hidden fees for premium cards and monthly minimums. They were also struggling with integrating their payment system with their dealer management software.",
        solution: "We implemented a dual pricing strategy that passed the costs of premium cards directly to customers who chose to use them. We also integrated their payment system directly with their dealer management software to streamline operations and reduce manual data entry.",
        results: "The dealership saved 18% on their processing costs, equating to $27,400 annually across all locations. The dual pricing model encouraged more customers to pay with debit cards or bank transfers, further reducing their costs. Their staff also saved approximately 15 hours per week in manual reconciliation time."
      },
      gradientFrom: "from-green-500",
      gradientTo: "to-green-400"
    }
  ];

  const openCaseStudy = (caseStudy: CaseStudy) => {
    setSelectedCase(caseStudy);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-orange-50 to-transparent py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-[#0EA5E9]">Case Studies</h1>
            <p className="text-xl text-[#0EA5E9] text-center mb-12">
              Real stories from real clients who have optimized their payment processing with Waveline.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {caseStudies.map((caseStudy, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className={`h-48 bg-gradient-to-r ${caseStudy.gradientFrom} ${caseStudy.gradientTo}`}></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{caseStudy.title}</h3>
                    <p className="text-gray-600 mb-4">{caseStudy.industry} | {caseStudy.shortDescription}</p>
                    <p className="mb-4">
                      {caseStudy.fullDescription.challenge.substring(0, 120)}...
                    </p>
                    <div className="flex items-center justify-between border-t pt-4 mt-4">
                      <div>
                        <p className="font-bold text-[#0EA5E9]">{caseStudy.metrics.label}</p>
                        <p className="text-sm text-gray-600">{caseStudy.metrics.value}</p>
                      </div>
                      <Button 
                        variant="link" 
                        className="text-[#0EA5E9] font-semibold"
                        onClick={() => openCaseStudy(caseStudy)}
                      >
                        Read More →
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-16">
              <p className="text-xl font-semibold text-[#0EA5E9] mb-4">
                Want to be our next success story?
              </p>
              <Button 
                onClick={() => navigate('/')} 
                className="bg-gradient-to-r from-[#0EA5E9] to-[#0EA5E9]/80 hover:from-[#0EA5E9]/80 hover:to-[#0EA5E9] text-white px-8 py-3 rounded-md font-medium"
              >
                Get Started Today
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedCase && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{selectedCase.title}</DialogTitle>
            </DialogHeader>
            
            <div className="mt-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#0EA5E9] mb-2">The Challenge</h3>
                <p className="text-gray-700">{selectedCase.fullDescription.challenge}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#0EA5E9] mb-2">Our Solution</h3>
                <p className="text-gray-700">{selectedCase.fullDescription.solution}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#0EA5E9] mb-2">The Results</h3>
                <p className="text-gray-700">{selectedCase.fullDescription.results}</p>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-xl text-[#0EA5E9]">{selectedCase.metrics.label}</p>
                    <p className="text-gray-600">{selectedCase.metrics.value}</p>
                  </div>
                  <Button 
                    onClick={() => navigate('/')}
                    className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white"
                  >
                    Submit Your Statement
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default CaseStudies;
