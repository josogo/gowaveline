
import React from 'react';
import { Ticket } from './iconsImport';
import { HighRiskIndustry } from '../types';

// Entertainment related industries
export const entertainmentIndustries: HighRiskIndustry[] = [
  {
    id: 19,
    title: "Ticket Brokers & Resellers",
    description: "Ticket resellers face high chargeback rates and scrutiny from payment processors due to event cancellations and delivery concerns.",
    icon: <Ticket className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our ticket broker payment solutions include specialized merchant accounts for secondary market sellers, chargeback prevention tools designed for ticket sales, and delivery confirmation integration to reduce disputes. We understand the unique challenges of the ticket resale industry and provide stable processing solutions."
  }
];
