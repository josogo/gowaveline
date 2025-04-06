
import React from 'react';
import { CreditCard, ShieldCheck, AlertTriangle, DollarSign, BarChart, Building, Globe } from 'lucide-react';
import { HighRiskIndustry } from './types';

export const industryData: HighRiskIndustry[] = [
  {
    id: 1,
    title: "CBD & Cannabis",
    description: "Legal CBD and cannabis businesses face unique payment processing challenges. We provide compliant solutions that keep your business running smoothly.",
    icon: <AlertTriangle className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our specialized CBD & Cannabis payment solutions include compliant merchant accounts that understand the legal distinctions in your industry, chargeback protection systems tailored for high-risk verticals, and banking relationships with institutions that specifically support cannabis-adjacent businesses. We'll help you navigate the complex regulatory landscape while maintaining reliable payment processing."
  },
  {
    id: 2,
    title: "Firearms & Ammunition",
    description: "Gun shops and firearm dealers need specialized processing. Our team understands the regulatory landscape and can help you navigate payment solutions.",
    icon: <ShieldCheck className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For firearms and ammunition retailers, we offer specialized high-risk merchant accounts that comply with federal regulations, secure payment gateways with enhanced fraud detection for weapon sales, and ongoing compliance monitoring to keep your business operating within legal boundaries. Our solutions ensure you can process payments reliably while adhering to all applicable laws."
  },
  {
    id: 3,
    title: "Adult Content & Dating",
    description: "Adult websites, content creators, and dating platforms require discreet, reliable payment processing that traditional banks often deny.",
    icon: <CreditCard className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our adult industry solutions include discreet billing descriptors that protect customer privacy, high-volume processing capabilities for subscription-based models, and specialized fraud prevention tools designed for dating and content platforms. We work with acquiring banks that understand your business model and won't suddenly terminate your account based on industry type."
  },
  {
    id: 4,
    title: "Cryptocurrency & Digital Assets",
    description: "Crypto exchanges, NFT marketplaces, and blockchain startups need payment solutions that bridge traditional finance and digital assets.",
    icon: <DollarSign className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For cryptocurrency and digital asset businesses, we provide payment solutions that bridge traditional and digital finance, with fiat on/off ramp processing capabilities, multi-currency support for global operations, and enhanced security protocols designed for blockchain-related transactions. Our banking partners understand the unique nature of crypto businesses and provide stable processing solutions."
  },
  {
    id: 5,
    title: "Peptides & Nutraceuticals",
    description: "Research chemicals, peptides, and supplement companies face high decline rates with conventional processors. Our solutions minimize this risk.",
    icon: <BarChart className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our nutraceutical and peptide merchant solutions include specialized underwriting that understands your product categories, compliant payment gateways that reduce declines and chargebacks, and recurring billing solutions optimized for subscription-based supplement sales. We'll help you navigate the complex regulations while keeping your payment processing stable and reliable."
  },
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
    id: 8,
    title: "Tobacco & E-cigarettes",
    description: "Vape shops, tobacco retailers, and e-cigarette manufacturers require specialized processing solutions to overcome regulatory hurdles.",
    icon: <AlertTriangle className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our tobacco and e-cigarette payment solutions include compliant merchant accounts familiar with age verification requirements, specialized fraud protection designed for vape and tobacco sales, and processing capabilities that work with the unique regulatory challenges of your industry. We'll help you navigate changing regulations while maintaining reliable payment processing."
  },
];
