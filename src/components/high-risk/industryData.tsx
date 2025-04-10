
import React from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  AlertTriangle, 
  DollarSign, 
  BarChart, 
  Building, 
  Globe, 
  Plane,
  Dice,
  GraduationCap,
  Handshake,
  Users,
  Home,
  Pill,
  Trophy,
  Ticket,
  Heart,
  Phone,
  Car,
  House,
  Copy,
  Package,
  ChartBar,
  Truck,
  Computer,
  BanknoteIcon,
  Hammer,
  ShoppingCart
} from 'lucide-react';
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
  {
    id: 9,
    title: "Travel",
    description: "Travel businesses often face high chargeback rates and payment processing restrictions due to advance bookings and service delivery delays.",
    icon: <Plane className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our travel industry payment solutions include specialized chargeback prevention tools, delayed settlement options to accommodate advance bookings, and fraud protection systems designed specifically for travel businesses. We understand the unique cashflow challenges of the travel industry and provide reliable processing that won't leave you stranded."
  },
  {
    id: 10,
    title: "Online Gambling & Sports Betting",
    description: "Gambling and sports betting platforms need compliant payment processing that can handle high volumes while managing regulatory requirements.",
    icon: <Dice className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For gambling and sports betting operators, we offer high-volume merchant accounts with strong fraud prevention tools, geolocation services to ensure regulatory compliance, and rapid settlement options to keep your platform running smoothly. Our solutions are designed to navigate the complex legal landscape while providing reliable payment processing."
  },
  {
    id: 11,
    title: "Coaching & Online Courses",
    description: "Coaching services and online course providers face challenges with traditional payment processors due to subscription models and chargeback risks.",
    icon: <GraduationCap className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "We support coaches and online education businesses with subscription-friendly payment solutions, customizable recurring billing options, and chargeback prevention tools that protect your revenue stream. Our merchant accounts are specifically designed to accommodate the unique business model of information and service-based businesses."
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
    id: 14,
    title: "Multi-Level Marketing (MLM)",
    description: "MLM businesses need payment solutions that can handle complex commission structures and distributed selling networks.",
    icon: <Users className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For MLM companies, we offer payment systems that integrate with commission structures, multi-tier affiliate tracking capabilities, and robust fraud prevention to protect your business and distributors. Our solutions are designed to scale with your network while maintaining compliance and stability."
  },
  {
    id: 15,
    title: "Timeshare & Vacation Ownership",
    description: "Timeshare businesses face unique payment processing challenges due to large upfront payments and recurring maintenance fees.",
    icon: <Home className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our timeshare payment solutions include high-ticket transaction processing, specialized underwriting for vacation ownership models, and recurring billing systems for maintenance fees. We help you navigate the high-risk classification while maintaining stable, reliable payment processing for both sales and ongoing fees."
  },
  {
    id: 16,
    title: "Online Pharmaceuticals",
    description: "Online pharmacy businesses need compliant payment processing that can handle regulatory scrutiny and validate prescriptions.",
    icon: <Pill className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For online pharmacies, we provide specialized merchant accounts that understand compliance requirements, secure payment gateways with prescription validation capabilities, and fraud prevention tools designed for pharmaceutical sales. Our solutions help you maintain regulatory compliance while processing payments reliably."
  },
  {
    id: 17,
    title: "Fantasy Sports Platforms",
    description: "Fantasy sports businesses require payment solutions that can handle high volumes of small transactions and seasonal fluctuations.",
    icon: <Trophy className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our fantasy sports payment solutions include high-volume micro-transaction processing, seasonal scaling capabilities, and specialized fraud prevention for gaming platforms. We understand the unique challenges of fantasy sports and provide stable processing that can handle your busiest seasons."
  },
  {
    id: 18,
    title: "Travel Agencies & Tour Operators",
    description: "Travel agencies and tour operators need payment processing that can handle advance bookings and protect against chargebacks.",
    icon: <Plane className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For travel agencies and tour operators, we offer merchant accounts with delayed settlement options, specialized chargeback protection for advance bookings, and multi-currency capabilities for international operations. Our solutions help you manage cashflow challenges while providing reliable payment processing for your clients."
  },
  {
    id: 19,
    title: "Ticket Brokers & Resellers",
    description: "Ticket resellers face high chargeback rates and scrutiny from payment processors due to event cancellations and delivery concerns.",
    icon: <Ticket className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our ticket broker payment solutions include specialized merchant accounts for secondary market sellers, chargeback prevention tools designed for ticket sales, and delivery confirmation integration to reduce disputes. We understand the unique challenges of the ticket resale industry and provide stable processing solutions."
  },
  {
    id: 20,
    title: "Dating Services",
    description: "Dating platforms need discreet, reliable payment processing that can handle subscription billing and high chargeback rates.",
    icon: <Heart className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For dating services, we provide merchant accounts with discreet billing descriptors, robust subscription management tools, and specialized fraud prevention designed for dating platforms. Our solutions ensure reliable processing without sudden account terminations that plague this industry."
  },
  {
    id: 21,
    title: "Telemedicine Services",
    description: "Telemedicine providers need HIPAA-compliant payment processing that can handle recurring billing and insurance integration.",
    icon: <Phone className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our telemedicine payment solutions include HIPAA-compliant processing systems, secure patient billing portals, and integration capabilities for insurance and HSA/FSA payments. We understand the regulatory requirements and provide stable, secure processing for virtual healthcare providers."
  },
  {
    id: 22,
    title: "Auto Warranty & Protection Plans",
    description: "Auto warranty companies face high scrutiny from payment processors due to chargeback risks and regulatory concerns.",
    icon: <Car className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For auto warranty providers, we offer specialized merchant accounts with contract verification systems, compliant billing procedures, and dispute management tools designed for your industry. Our solutions help you maintain stable payment processing while navigating the high-risk classification."
  },
  {
    id: 23,
    title: "Loan Modifications & Foreclosure Services",
    description: "Mortgage assistance businesses need payment processing that complies with advance fee regulations while managing chargeback risks.",
    icon: <House className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our loan modification payment solutions include escrow-compatible merchant accounts, compliant billing systems for regulated services, and documentation tools to prevent chargebacks. We help you navigate complex regulations while maintaining reliable payment processing capabilities."
  },
  {
    id: 24,
    title: "Replica & Gray Market Goods",
    description: "Businesses selling replica or gray market items need specialized payment processing that understands their unique challenges.",
    icon: <Copy className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For replica and gray market retailers, we provide merchant accounts with clear policies, chargeback prevention systems tailored to your products, and international processing capabilities. Our solutions help you operate legally while maintaining stable payment processing."
  },
  {
    id: 25,
    title: "Subscription Box Services",
    description: "Subscription boxes face high chargeback rates and processing challenges due to recurring billing and product delivery timelines.",
    icon: <Package className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our subscription box payment solutions include specialized recurring billing platforms, dunning management tools to prevent failed payments, and delivery confirmation integration to reduce chargebacks. We understand subscription economics and provide stable processing that grows with your business."
  },
  {
    id: 26,
    title: "Online Forex & Binary Options",
    description: "Forex and trading platforms need payment processing that can handle high volumes and navigate complex financial regulations.",
    icon: <ChartBar className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For forex and trading platforms, we offer merchant accounts with multi-currency capabilities, compliance monitoring for financial regulations, and high-volume processing designed for trading businesses. Our solutions help you operate within regulatory frameworks while providing reliable payment processing."
  },
  {
    id: 27,
    title: "Drop Shipping Businesses",
    description: "Drop shippers face payment processing challenges due to extended delivery times and product quality concerns.",
    icon: <Truck className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our drop shipping payment solutions include merchant accounts that understand extended fulfillment timelines, shipping integration to reduce chargebacks, and fraud prevention tools designed for e-commerce. We help you maintain reliable processing despite the high-risk classification of many drop shipping categories."
  },
  {
    id: 28,
    title: "Tech Support Services",
    description: "Remote tech support businesses need specialized processing due to high chargeback rates and regulatory scrutiny.",
    icon: <Computer className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For tech support services, we provide merchant accounts with clear service documentation systems, compliant billing practices, and dispute prevention tools. Our solutions help legitimate tech support providers maintain stable processing despite industry-wide scrutiny."
  },
  {
    id: 29,
    title: "Charter Flights & Airlines",
    description: "Independent airlines and charter services need payment solutions that can handle large transactions and advance bookings.",
    icon: <Plane className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our aviation payment solutions include high-ticket transaction processing, delayed settlement options for advance bookings, and chargeback protection designed for air travel. We understand the unique challenges of flight operations and provide stable processing for your business."
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
  },
  {
    id: 32,
    title: "Auction Houses",
    description: "Auction businesses need payment processing that can handle high-value transactions and verification of both buyers and sellers.",
    icon: <Hammer className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "For auction houses, we provide merchant accounts with high-ticket transaction capabilities, escrow-compatible payment options, and buyer/seller verification systems. Our solutions help you manage the unique risks of auction sales while maintaining reliable payment processing."
  },
  {
    id: 33,
    title: "Online Furniture & Large Ticket Retail",
    description: "Furniture retailers and large ticket sellers face processing challenges due to delivery timeframes and big-ticket transactions.",
    icon: <ShoppingCart className="h-10 w-10 text-[#0EA5E9]" />,
    helpText: "Our large ticket retail solutions include specialized merchant accounts for big purchases, delivery confirmation integration to prevent chargebacks, and financing options for your customers. We help furniture and high-value retailers maintain stable processing despite industry-specific challenges."
  },
];

