
import React from 'react';
import { BarChart, Pill, Phone } from './iconsImport';
import { HighRiskIndustry } from '../types';

// Health and wellness related industries
export const healthIndustries: HighRiskIndustry[] = [
  {
    id: 5,
    title: "Peptides & Nutraceuticals",
    description: "Research chemicals, peptides, and supplement companies face high decline rates with conventional processors. Our solutions minimize this risk.",
    icon: <BarChart className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our nutraceutical and peptide merchant solutions include specialized underwriting that understands your product categories, compliant payment gateways that reduce declines and chargebacks, and recurring billing solutions optimized for subscription-based supplement sales. We'll help you navigate the complex regulations while keeping your payment processing stable and reliable."
  },
  {
    id: 16,
    title: "Online Pharmaceuticals",
    description: "Online pharmacy businesses need compliant payment processing that can handle regulatory scrutiny and validate prescriptions.",
    icon: <Pill className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For online pharmacies, we provide specialized merchant accounts that understand compliance requirements, secure payment gateways with prescription validation capabilities, and fraud prevention tools designed for pharmaceutical sales. Our solutions help you maintain regulatory compliance while processing payments reliably."
  },
  {
    id: 21,
    title: "Telemedicine Services",
    description: "Telemedicine providers need HIPAA-compliant payment processing that can handle recurring billing and insurance integration.",
    icon: <Phone className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our telemedicine payment solutions include HIPAA-compliant processing systems, secure patient billing portals, and integration capabilities for insurance and HSA/FSA payments. We understand the regulatory requirements and provide stable, secure processing for virtual healthcare providers."
  }
];
