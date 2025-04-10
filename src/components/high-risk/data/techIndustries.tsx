
import React from 'react';
import { Building, Globe, Computer } from './iconsImport';
import { HighRiskIndustry } from '../types';

// Tech related industries
export const techIndustries: HighRiskIndustry[] = [
  {
    id: 6,
    title: "Startups & New Ventures",
    description: "Early-stage companies with limited processing history often struggle to secure merchant accounts. We specialize in helping startups establish payment infrastructure.",
    icon: <Building className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For startups and new ventures, we offer flexible merchant accounts with growth-friendly terms, scalable payment solutions that grow with your business, and risk assessment services that help you establish a positive processing history. Our startup-friendly approach means we can often approve businesses with limited history where traditional processors would decline."
  },
  {
    id: 7,
    title: "AI & Emerging Technologies",
    description: "AI services, virtual companions, and cutting-edge tech companies need payment solutions that understand their unique business models.",
    icon: <Globe className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For AI and emerging technology businesses, we provide forward-thinking payment solutions that accommodate innovative business models, international processing capabilities for global tech services, and subscription management tools designed for SaaS and AI service providers. Our tech-savvy underwriting team understands novel business concepts that traditional banks often misclassify."
  },
  {
    id: 28,
    title: "Tech Support Services",
    description: "Remote tech support businesses need specialized processing due to high chargeback rates and regulatory scrutiny.",
    icon: <Computer className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For tech support services, we provide merchant accounts with clear service documentation systems, compliant billing practices, and dispute prevention tools. Our solutions help legitimate tech support providers maintain stable processing despite industry-wide scrutiny."
  }
];
