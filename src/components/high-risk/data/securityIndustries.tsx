
import React from 'react';
import { ShieldCheck } from './iconsImport';
import { HighRiskIndustry } from '../types';

// Firearms & Security related industries
export const securityIndustries: HighRiskIndustry[] = [
  {
    id: 2,
    title: "Firearms & Ammunition",
    description: "Gun shops and firearm dealers need specialized processing. Our team understands the regulatory landscape and can help you navigate payment solutions.",
    icon: <ShieldCheck className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For firearms and ammunition retailers, we offer specialized high-risk merchant accounts that comply with federal regulations, secure payment gateways with enhanced fraud detection for weapon sales, and ongoing compliance monitoring to keep your business operating within legal boundaries. Our solutions ensure you can process payments reliably while adhering to all applicable laws."
  }
];
