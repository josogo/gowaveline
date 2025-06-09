
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Download, TrendingUp, Users, Shield, Zap, CheckCircle, DollarSign } from 'lucide-react';

const PartnershipGuide = () => {
  const handleDownload = () => {
    // Create the content for the PDF
    const content = `
WAVELINE PARTNERSHIP PROGRAM
Your Gateway to Payment Processing Success

WHY PARTNER WITH WAVELINE?

✓ INDUSTRY-LEADING COMPENSATION
• Competitive residual splits up to 70%
• Fast-track bonus programs for top performers
• Lifetime residual income on all accounts

✓ COMPREHENSIVE SUPPORT SYSTEM
• Dedicated relationship manager
• 24/7 technical support
• Complete sales and marketing resources
• Professional training and certification programs

✓ TRANSPARENT PRICING PROTECTION
• No hidden fees for your merchants
• Competitive interchange-plus pricing models
• Clear, straightforward contract terms
• Merchant protection guarantee

✓ CUTTING-EDGE TECHNOLOGY
• Advanced payment processing solutions
• Mobile and online payment capabilities
• Point-of-sale system integrations
• Real-time reporting and analytics

PARTNERSHIP OPPORTUNITIES

AGENT PROGRAM
Perfect for sales professionals
• Quick application approval process
• Immediate access to competitive rates
• Complete marketing materials provided
• Monthly residual payments

ISO PROGRAM
For established sales organizations
• Custom pricing programs
• White-label solutions available
• Sub-agent management tools
• Portfolio growth support

ISV PROGRAM
For software integrators
• Developer-friendly APIs
• Technical integration support
• Revenue sharing opportunities
• Ongoing development resources

GET STARTED TODAY
Contact our Partnership Team:
📧 partners@waveline.com
📞 1-800-WAVELINE
🌐 www.waveline.com/partners

Building Success Together Since Day One
    `;

    // Create a downloadable text file (in a real implementation, you'd want to generate a proper PDF)
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Waveline-Partnership-Guide.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      <Navbar />
      
      <div className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <Download className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-orange-500 mb-6">
                Partnership Program Guide
              </h1>
              <p className="text-xl text-[#0EA5E9] max-w-2xl mx-auto">
                Everything you need to know about joining Waveline's partner network and building a successful payment processing business.
              </p>
            </div>
            
            <Button 
              onClick={handleDownload}
              className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white px-8 py-4 text-lg rounded-lg shadow-lg"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Complete Guide
            </Button>
          </div>
        </section>

        {/* Key Benefits Preview */}
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-orange-500 mb-12 text-center">What's Inside the Guide</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-orange-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <DollarSign className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-bold text-orange-500 mb-3">Compensation Structure</h3>
                  <p className="text-[#0EA5E9] mb-4">
                    Detailed breakdown of our industry-leading commission rates, bonus programs, and residual income opportunities.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center text-[#0EA5E9]">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Up to 70% residual splits
                    </li>
                    <li className="flex items-center text-[#0EA5E9]">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Fast-track bonuses
                    </li>
                    <li className="flex items-center text-[#0EA5E9]">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Lifetime residuals
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-orange-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-blue-500 mb-4" />
                  <h3 className="text-xl font-bold text-orange-500 mb-3">Support System</h3>
                  <p className="text-[#0EA5E9] mb-4">
                    Comprehensive overview of our partner support infrastructure and resources available to help you succeed.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center text-[#0EA5E9]">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Dedicated relationship manager
                    </li>
                    <li className="flex items-center text-[#0EA5E9]">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      24/7 technical support
                    </li>
                    <li className="flex items-center text-[#0EA5E9]">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Training & certification
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-orange-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Zap className="h-12 w-12 text-yellow-500 mb-4" />
                  <h3 className="text-xl font-bold text-orange-500 mb-3">Technology Solutions</h3>
                  <p className="text-[#0EA5E9] mb-4">
                    Details about our cutting-edge payment processing technology and integration capabilities.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center text-[#0EA5E9]">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Advanced payment solutions
                    </li>
                    <li className="flex items-center text-[#0EA5E9]">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Mobile & online capabilities
                    </li>
                    <li className="flex items-center text-[#0EA5E9]">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Real-time analytics
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-orange-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Shield className="h-12 w-12 text-purple-500 mb-4" />
                  <h3 className="text-xl font-bold text-orange-500 mb-3">Merchant Protection</h3>
                  <p className="text-[#0EA5E9] mb-4">
                    Learn about our transparent pricing model and merchant protection guarantees that build trust.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center text-[#0EA5E9]">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      No hidden fees
                    </li>
                    <li className="flex items-center text-[#0EA5E9]">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Transparent pricing
                    </li>
                    <li className="flex items-center text-[#0EA5E9]">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Clear contracts
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-orange-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <TrendingUp className="h-12 w-12 text-orange-500 mb-4" />
                  <h3 className="text-xl font-bold text-orange-500 mb-3">Growth Strategies</h3>
                  <p className="text-[#0EA5E9] mb-4">
                    Proven strategies and best practices for building and scaling your payment processing business.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center text-[#0EA5E9]">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Sales methodologies
                    </li>
                    <li className="flex items-center text-[#0EA5E9]">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Marketing resources
                    </li>
                    <li className="flex items-center text-[#0EA5E9]">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Portfolio management
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-orange-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-bold text-orange-500 mb-3">Getting Started</h3>
                  <p className="text-[#0EA5E9] mb-4">
                    Step-by-step guide to joining our partner program and getting your business up and running quickly.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center text-[#0EA5E9]">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Application process
                    </li>
                    <li className="flex items-center text-[#0EA5E9]">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Onboarding timeline
                    </li>
                    <li className="flex items-center text-[#0EA5E9]">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      First 90 days roadmap
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6 md:px-12 bg-gradient-to-r from-orange-500 to-orange-400">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Your Partnership Journey?</h2>
            <p className="text-xl text-white mb-8">
              Download the complete guide and take the first step towards building a successful payment processing business with Waveline.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                onClick={handleDownload}
                className="bg-white text-orange-500 hover:bg-orange-50 px-8 py-4 text-lg rounded-lg shadow-lg"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Partnership Guide
              </Button>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default PartnershipGuide;
