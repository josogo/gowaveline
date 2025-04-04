
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const CaseStudies = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-orange-50 to-transparent py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-[#0EA5E9]">Case Studies</h1>
            <p className="text-xl text-[#0EA5E9] text-center mb-12">
              Real stories from real clients who have optimized their payment processing with Waveline.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {/* Case Study 1 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-[#0EA5E9] to-orange-400"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">E-Commerce Retailer Saves 23% on Processing</h3>
                  <p className="text-gray-600 mb-4">Online retail business with $1.2M in annual volume</p>
                  <p className="mb-4">
                    This growing online retailer was paying excessive fees with their previous processor. 
                    After our analysis, we identified overcharges and implemented a custom pricing model.
                  </p>
                  <div className="flex items-center justify-between border-t pt-4 mt-4">
                    <div>
                      <p className="font-bold text-[#0EA5E9]">23% Savings</p>
                      <p className="text-sm text-gray-600">$34,500 annual reduction</p>
                    </div>
                    <button className="text-[#0EA5E9] font-semibold">Read More →</button>
                  </div>
                </div>
              </div>
              
              {/* Case Study 2 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-orange-400 to-[#0EA5E9]"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">High-Risk CBD Business Gets Approved</h3>
                  <p className="text-gray-600 mb-4">CBD manufacturer rejected by 5 other processors</p>
                  <p className="mb-4">
                    After being denied by multiple payment processors, this CBD business was struggling to 
                    accept online payments. We secured approval and provided stable processing.
                  </p>
                  <div className="flex items-center justify-between border-t pt-4 mt-4">
                    <div>
                      <p className="font-bold text-[#0EA5E9]">2.9% Rate</p>
                      <p className="text-sm text-gray-600">Previously denied service</p>
                    </div>
                    <button className="text-[#0EA5E9] font-semibold">Read More →</button>
                  </div>
                </div>
              </div>
              
              {/* Case Study 3 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-[#0EA5E9]/70 to-[#0EA5E9]"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Restaurant Chain Switches POS Systems</h3>
                  <p className="text-gray-600 mb-4">5-location restaurant business with outdated POS</p>
                  <p className="mb-4">
                    This restaurant chain was using outdated POS hardware with expensive monthly fees. 
                    We implemented a modern, integrated solution that improved operations.
                  </p>
                  <div className="flex items-center justify-between border-t pt-4 mt-4">
                    <div>
                      <p className="font-bold text-[#0EA5E9]">15% Savings</p>
                      <p className="text-sm text-gray-600">Improved customer experience</p>
                    </div>
                    <button className="text-[#0EA5E9] font-semibold">Read More →</button>
                  </div>
                </div>
              </div>
              
              {/* Case Study 4 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-[#0EA5E9] to-[#0EA5E9]/70"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Crypto Exchange Secures Banking</h3>
                  <p className="text-gray-600 mb-4">Digital asset platform with compliance challenges</p>
                  <p className="mb-4">
                    This cryptocurrency exchange struggled to find banking solutions due to
                    regulatory concerns. We established relationships with crypto-friendly banks.
                  </p>
                  <div className="flex items-center justify-between border-t pt-4 mt-4">
                    <div>
                      <p className="font-bold text-[#0EA5E9]">30 Days</p>
                      <p className="text-sm text-gray-600">From application to approval</p>
                    </div>
                    <button className="text-[#0EA5E9] font-semibold">Read More →</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-16">
              <p className="text-xl font-semibold text-[#0EA5E9] mb-4">
                Want to be our next success story?
              </p>
              <button 
                onClick={() => window.location.href = '/get-started'} 
                className="bg-gradient-to-r from-[#0EA5E9] to-[#0EA5E9]/80 hover:from-[#0EA5E9]/80 hover:to-[#0EA5E9] text-white px-8 py-3 rounded-md font-medium"
              >
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CaseStudies;
