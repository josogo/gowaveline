
import React from 'react';
import { DollarSign, ChartBar, Handshake, BanknoteIcon, House } from './iconsImport';
import { HighRiskIndustry } from '../types';

// Financial and investment related industries
export const financialIndustries: HighRiskIndustry[] = [
  {
    id: 4,
    title: "Cryptocurrency & Digital Assets",
    description: "Crypto exchanges, NFT marketplaces, and blockchain startups need payment solutions that bridge traditional finance and digital assets.",
    icon: <DollarSign className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For cryptocurrency and digital asset businesses, we provide payment solutions that bridge traditional and digital finance, with fiat on/off ramp processing capabilities, multi-currency support for global operations, and enhanced security protocols designed for blockchain-related transactions. Our banking partners understand the unique nature of crypto businesses and provide stable processing solutions."
  },
  {
    id: 12,
    title: "Credit Repair Services",
    description: "Credit repair businesses need specialized processing solutions that understand the unique regulatory requirements and chargeback risks in this industry.",
    icon: <Handshake className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For credit repair services, we provide compliant merchant accounts that understand the Telemarketing Sales Rule and other regulations, secure payment gateways with enhanced verification, and documentation systems to help prevent chargebacks. Our solutions enable you to process payments reliably while maintaining regulatory compliance."
  },
  {
    id: 13,
    title: "Debt Collection Agencies",
    description: "Debt collection companies require payment processing that can handle sensitive financial transactions while navigating complex regulations.",
    icon: <BanknoteIcon className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our solutions for debt collection agencies include FDCPA-compliant payment gateways, secure tokenization for recurring payments, and specialized reporting tools designed for the collections industry. We understand the unique challenges of processing payments for debt collection and provide stable, reliable solutions."
  },
  {
    id: 23,
    title: "Loan Modifications & Foreclosure Services",
    description: "Mortgage assistance businesses need payment processing that complies with advance fee regulations while managing chargeback risks.",
    icon: <House className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our loan modification payment solutions include escrow-compatible merchant accounts, compliant billing systems for regulated services, and documentation tools to prevent chargebacks. We help you navigate complex regulations while maintaining reliable payment processing capabilities."
  },
  {
    id: 26,
    title: "Online Forex & Binary Options",
    description: "Forex and trading platforms need payment processing that can handle high volumes and navigate complex financial regulations.",
    icon: <ChartBar className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For forex and trading platforms, we offer merchant accounts with multi-currency capabilities, compliance monitoring for financial regulations, and high-volume processing designed for trading businesses. Our solutions help you operate within regulatory frameworks while providing reliable payment processing."
  },
  {
    id: 30,
    title: "Investment Advice & Trading Signals",
    description: "Investment advisors and signal providers need compliant payment processing that can handle subscription models and regulatory requirements.",
    icon: <ChartBar className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For investment advice services, we offer merchant accounts compliant with financial regulations, subscription management tools for recurring revenue, and documentation systems to prevent disputes. Our solutions help you maintain stable processing while navigating complex regulatory requirements."
  },
  {
    id: 31,
    title: "Check Cashing & Money Services",
    description: "Money service businesses need specialized payment processing that complies with AML and KYC requirements.",
    icon: <BanknoteIcon className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our money service business solutions include BSA/AML-compliant merchant accounts, identity verification integration, and specialized reporting tools for regulatory compliance. We understand the unique requirements of money services and provide stable processing options."
  }
];
