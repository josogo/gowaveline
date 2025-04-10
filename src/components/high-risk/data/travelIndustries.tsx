
import React from 'react';
import { Plane } from './iconsImport';
import { HighRiskIndustry } from '../types';

// Travel related industries
export const travelIndustries: HighRiskIndustry[] = [
  {
    id: 9,
    title: "Travel",
    description: "Travel businesses often face high chargeback rates and payment processing restrictions due to advance bookings and service delivery delays.",
    icon: <Plane className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our travel industry payment solutions include specialized chargeback prevention tools, delayed settlement options to accommodate advance bookings, and fraud protection systems designed specifically for travel businesses. We understand the unique cashflow challenges of the travel industry and provide reliable processing that won't leave you stranded."
  },
  {
    id: 18,
    title: "Travel Agencies & Tour Operators",
    description: "Travel agencies and tour operators need payment processing that can handle advance bookings and protect against chargebacks.",
    icon: <Plane className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For travel agencies and tour operators, we offer merchant accounts with delayed settlement options, specialized chargeback protection for advance bookings, and multi-currency capabilities for international operations. Our solutions help you manage cashflow challenges while providing reliable payment processing for your clients."
  },
  {
    id: 29,
    title: "Charter Flights & Airlines",
    description: "Independent airlines and charter services need payment solutions that can handle large transactions and advance bookings.",
    icon: <Plane className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our aviation payment solutions include high-ticket transaction processing, delayed settlement options for advance bookings, and chargeback protection designed for air travel. We understand the unique challenges of flight operations and provide stable processing for your business."
  }
];
