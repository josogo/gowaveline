
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    {
      question: "What is payment processing?",
      answer: "Payment processing is the automated process that handles transactions between a customer and a business. It involves securely transferring funds from the customer's bank account or credit card to the merchant's account through various financial institutions and networks."
    },
    {
      question: "How do payment processing fees work?",
      answer: "Payment processing fees typically include interchange fees (paid to the card-issuing bank), assessment fees (paid to the card network like Visa or Mastercard), and processor markup fees. These are usually calculated as a percentage of each transaction plus a fixed fee per transaction."
    },
    {
      question: "What is an effective rate?",
      answer: "The effective rate is the total cost of processing payments divided by your total sales volume, expressed as a percentage. It includes all fees and charges related to payment processing, giving you a comprehensive view of what you're actually paying."
    },
    {
      question: "What is considered a high-risk merchant?",
      answer: "High-risk merchants typically operate in industries with higher instances of fraud, chargebacks, or regulatory scrutiny. Examples include online gaming, adult entertainment, CBD products, subscription services, travel agencies, and businesses with poor credit histories or high-ticket items."
    },
    {
      question: "Why are some businesses considered high-risk?",
      answer: "Businesses may be labeled high-risk due to industry-specific factors (like high chargeback rates), regulatory considerations, processing history, average transaction size, or operating in countries with higher fraud rates."
    },
    {
      question: "What are chargebacks and why are they important?",
      answer: "Chargebacks occur when a customer disputes a transaction with their bank instead of seeking a refund directly from the merchant. High chargeback rates can lead to increased fees, account freezes, or even termination of your merchant account. Maintaining a chargeback rate below 1% of transactions is generally advised."
    },
    {
      question: "What is the difference between a payment gateway and a payment processor?",
      answer: "A payment gateway securely transfers payment information from a website to the payment processor. The payment processor then routes this information through the appropriate channels (card networks, banks) to authorize and complete the transaction. Think of the gateway as the digital point-of-sale terminal and the processor as the service that manages the actual money movement."
    },
    {
      question: "How can I reduce my payment processing costs?",
      answer: "You can reduce costs by negotiating better interchange rates, minimizing chargebacks through good customer service, using address verification services and fraud protection tools, properly categorizing your business, and regularly reviewing your merchant statements to identify hidden fees."
    },
    {
      question: "What is PCI compliance and why is it important?",
      answer: "PCI DSS (Payment Card Industry Data Security Standard) is a set of security standards designed to ensure all companies that process, store, or transmit credit card information maintain a secure environment. Non-compliance can result in fines, increased transaction fees, and potentially losing the ability to process card payments."
    },
    {
      question: "What types of payment methods should my business accept?",
      answer: "Most businesses should accept major credit and debit cards (Visa, Mastercard, American Express, Discover). Depending on your customer base, you might also consider digital wallets (Apple Pay, Google Pay), ACH transfers, cryptocurrency, buy-now-pay-later options, or industry-specific payment methods."
    },
    {
      question: "How long does it take to set up a merchant account?",
      answer: "Standard merchant accounts typically take 2-5 business days to set up. High-risk merchant accounts may take longer, usually 1-2 weeks, due to additional underwriting and documentation requirements."
    },
    {
      question: "What is a payment descriptor and why does it matter?",
      answer: "A payment descriptor is the name that appears on your customer's credit card statement when they make a purchase from you. A clear descriptor helps customers recognize their purchases and can significantly reduce chargebacks from customers who don't recognize the charge."
    },
    {
      question: "Can I process transactions internationally?",
      answer: "Yes, but international payment processing often involves additional fees, including currency conversion fees, cross-border fees, and sometimes higher processing rates. Make sure your payment processor supports the regions where you plan to sell."
    },
    {
      question: "What is a merchant statement analysis?",
      answer: "A merchant statement analysis is a comprehensive review of your payment processing statements to identify all fees, determine if they're competitive, and find opportunities to reduce costs. Our analysis breaks down complex fee structures and provides clear recommendations for optimization."
    },
    {
      question: "How often should I review my payment processing setup?",
      answer: "You should review your payment processing setup at least annually, or whenever your business experiences significant changes in transaction volume, average ticket size, or after entering new markets. Regular reviews help ensure you're getting the most competitive rates."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <div className="bg-gradient-to-b from-orange-50 to-transparent py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-orange-500 mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-[#0EA5E9] max-w-3xl mx-auto">
              Find answers to common questions about payment processing and our services
            </p>
          </div>
        </div>

        <div className="py-12 px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-6">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  value={`item-${index}`} 
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-4 bg-white hover:bg-orange-50 text-left font-medium text-lg text-orange-500">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 bg-white/80 text-[#0EA5E9]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
