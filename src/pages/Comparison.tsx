
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

const Comparison = () => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const showDemo = () => {
    setDialogOpen(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-orange-50 to-transparent py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-[#0EA5E9]">
              Why Choose Waveline Over Payment Facilitators
            </h1>
            <p className="text-xl text-center mb-16 max-w-3xl mx-auto text-gray-600">
              Understanding the difference between traditional merchant accounts and payment facilitators like Stripe and Shopify
            </p>
            
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-8">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6 text-[#0EA5E9]">Lower Rates, More Flexibility</h2>
                <p className="text-lg mb-6 text-gray-600">
                  While platforms like Stripe and Shopify offer convenience, they come at a premium cost. 
                  Waveline's traditional merchant accounts provide significantly lower processing fees, 
                  especially as your volume increases.
                </p>
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white px-8 py-3 text-lg"
                  onClick={showDemo}
                >
                  See How Much You Can Save
                </Button>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1459257831348-f0cdd359235f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="Cost Comparison" 
                  className="w-full h-auto rounded-lg shadow-xl"
                />
              </div>
            </div>
            
            {/* Comparison Table */}
            <div className="mb-20">
              <h2 className="text-3xl font-bold mb-10 text-center text-[#0EA5E9]">Waveline vs. Payment Facilitators</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#0EA5E9] text-white">
                      <th className="p-4 text-left">Features</th>
                      <th className="p-4 text-center">Waveline</th>
                      <th className="p-4 text-center">Stripe</th>
                      <th className="p-4 text-center">Shopify Payments</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Processing Fees</td>
                      <td className="p-4 text-center bg-green-50">Interchange + 0.1% - 0.3%</td>
                      <td className="p-4 text-center">2.9% + $0.30</td>
                      <td className="p-4 text-center">2.4% - 2.9% + $0.30</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Monthly Fee</td>
                      <td className="p-4 text-center bg-green-50">$10-$20</td>
                      <td className="p-4 text-center">$0</td>
                      <td className="p-4 text-center">$29-$299 (platform fee)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Account Type</td>
                      <td className="p-4 text-center bg-green-50">Dedicated Merchant Account</td>
                      <td className="p-4 text-center">Aggregated Account</td>
                      <td className="p-4 text-center">Aggregated Account</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Account Stability</td>
                      <td className="p-4 text-center bg-green-50">High</td>
                      <td className="p-4 text-center">Medium</td>
                      <td className="p-4 text-center">Medium</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">High-Risk Support</td>
                      <td className="p-4 text-center bg-green-50">Extensive</td>
                      <td className="p-4 text-center">Limited</td>
                      <td className="p-4 text-center">Limited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Custom Pricing</td>
                      <td className="p-4 text-center bg-green-50">Yes</td>
                      <td className="p-4 text-center">Only for Enterprise</td>
                      <td className="p-4 text-center">No</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Personal Support</td>
                      <td className="p-4 text-center bg-green-50">Dedicated Representative</td>
                      <td className="p-4 text-center">Email/Chat Support</td>
                      <td className="p-4 text-center">Email/Chat Support</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Understanding the Differences */}
            <div className="mb-20">
              <h2 className="text-3xl font-bold mb-8 text-[#0EA5E9]">Understanding Payment Models</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h3 className="text-2xl font-bold mb-4 text-[#0EA5E9]">Payment Facilitators (PayFacs)</h3>
                  <p className="mb-4 text-gray-600">
                    Stripe and Shopify operate as payment facilitators, providing sub-merchant accounts under 
                    their master merchant account. This means:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Quick and easy setup</li>
                    <li>Higher processing fees</li>
                    <li>Greater risk of account holds or terminations</li>
                    <li>One-size-fits-all pricing structure</li>
                    <li>Limited support for high-risk industries</li>
                    <li>Funds typically held for 2+ days</li>
                  </ul>
                </div>
                
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h3 className="text-2xl font-bold mb-4 text-[#0EA5E9]">Traditional Merchant Accounts</h3>
                  <p className="mb-4 text-gray-600">
                    Waveline provides dedicated merchant accounts directly with acquiring banks, offering:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Significantly lower processing rates</li>
                    <li>Greater account stability and security</li>
                    <li>Customized solutions for your business needs</li>
                    <li>Specialized options for high-risk industries</li>
                    <li>Dedicated support representative</li>
                    <li>Faster access to funds (often next-day)</li>
                    <li>Multiple redundant processing options</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Case Study */}
            <div className="bg-white p-8 rounded-lg shadow-md mb-20">
              <h2 className="text-3xl font-bold mb-6 text-[#0EA5E9]">Real Savings: Customer Case Study</h2>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold mb-4">E-commerce Retailer Saves $27,000 Annually</h3>
                  <p className="mb-4 text-gray-600">
                    An online retailer processing $1.2 million annually with Stripe was paying nearly $35,000 
                    in processing fees. After switching to Waveline:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Processing fees reduced to just under $8,000 per year</li>
                    <li>Annual savings of $27,000</li>
                    <li>Improved cash flow with next-day funding</li>
                    <li>Enhanced fraud protection tools</li>
                    <li>Dedicated account manager for ongoing support</li>
                  </ul>
                </div>
                <div className="md:w-1/3">
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h4 className="text-lg font-bold mb-2 text-orange-500">Before Waveline:</h4>
                    <p className="text-2xl font-bold text-gray-700 mb-4">$35,000/year</p>
                    <h4 className="text-lg font-bold mb-2 text-[#0EA5E9]">With Waveline:</h4>
                    <p className="text-2xl font-bold text-gray-700 mb-4">$8,000/year</p>
                    <p className="text-xl font-bold text-orange-500">72% Savings</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA Section */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6 text-[#0EA5E9]">Ready to Lower Your Processing Costs?</h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-600">
                Submit your current merchant statement for a free analysis and see how much you could save by switching to Waveline.
              </p>
              <Button 
                className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white px-8 py-3 text-lg"
                onClick={showDemo}
              >
                Get Your Free Analysis
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request a Free Analysis</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right font-medium col-span-1">
                Name
              </label>
              <input
                id="name"
                className="col-span-3 p-2 border rounded"
                placeholder="Your full name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="company" className="text-right font-medium col-span-1">
                Company
              </label>
              <input
                id="company"
                className="col-span-3 p-2 border rounded"
                placeholder="Your company name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right font-medium col-span-1">
                Email
              </label>
              <input
                id="email"
                className="col-span-3 p-2 border rounded"
                placeholder="Your email address"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="phone" className="text-right font-medium col-span-1">
                Phone
              </label>
              <input
                id="phone"
                className="col-span-3 p-2 border rounded"
                placeholder="Your phone number"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80 text-white"
              onClick={() => {
                // Handle submission
                setDialogOpen(false);
                navigate('/');
              }}
            >
              Submit Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Comparison;
