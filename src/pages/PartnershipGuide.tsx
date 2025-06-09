
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Download, TrendingUp, Users, Shield, Zap, CheckCircle, DollarSign, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';

const PartnershipGuide = () => {
  const handleDownload = async () => {
    console.log('Starting PDF generation...');
    
    try {
      // Create a new PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Set up colors and fonts
      const primaryColor = [255, 159, 90]; // Orange #FF9F5A
      const secondaryColor = [14, 165, 233]; // Blue #0EA5E9
      const textColor = [51, 51, 51]; // Dark gray
      const lightGray = [245, 245, 245];

      // Page 1 - Cover Page
      // Background gradient effect
      doc.setFillColor(255, 248, 240); // Light orange background
      doc.rect(0, 0, 210, 297, 'F');

      // Header section with company branding
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 60, 'F');

      // Company name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(32);
      doc.setTextColor(255, 255, 255);
      doc.text('WAVELINE', 105, 25, { align: 'center' });
      
      doc.setFontSize(18);
      doc.text('PAYMENTS', 105, 35, { align: 'center' });

      // Subtitle
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Professional Payment Processing Solutions', 105, 45, { align: 'center' });

      // Main title
      doc.setTextColor(...textColor);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      doc.text('PARTNERSHIP', 105, 85, { align: 'center' });
      doc.text('PROGRAM GUIDE', 105, 100, { align: 'center' });

      // Subtitle
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(16);
      doc.setTextColor(...secondaryColor);
      doc.text('Your Gateway to Payment Processing Success', 105, 120, { align: 'center' });

      // Key benefits preview
      doc.setFontSize(14);
      doc.setTextColor(...textColor);
      doc.setFont('helvetica', 'bold');
      doc.text('What You\'ll Discover:', 20, 150);

      const benefits = [
        'Industry-leading compensation structures',
        'Comprehensive support and training programs',
        'Cutting-edge technology solutions',
        'Transparent pricing and merchant protection',
        'Multiple partnership opportunities',
        'Step-by-step getting started guide'
      ];

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      benefits.forEach((benefit, index) => {
        doc.setFillColor(...primaryColor);
        doc.circle(25, 162 + (index * 12), 2, 'F');
        doc.setTextColor(...textColor);
        doc.text(benefit, 32, 165 + (index * 12));
      });

      // Contact info box
      doc.setFillColor(...lightGray);
      doc.roundedRect(20, 240, 170, 35, 3, 3, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(...primaryColor);
      doc.text('Ready to Get Started?', 105, 250, { align: 'center' });
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...textColor);
      doc.text('Contact: partners@waveline.com | 1-800-WAVELINE', 105, 260, { align: 'center' });
      doc.text('Visit: www.waveline.com/partners', 105, 270, { align: 'center' });

      // Page 2 - Why Partner With Waveline
      doc.addPage();
      
      // Header
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 25, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text('WHY PARTNER WITH WAVELINE?', 105, 15, { align: 'center' });

      let yPos = 40;

      // Industry-Leading Compensation
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('✓ INDUSTRY-LEADING COMPENSATION', 20, yPos);
      yPos += 10;

      const compensationPoints = [
        'Competitive residual splits up to 70%',
        'Fast-track bonus programs for top performers',
        'Lifetime residual income on all accounts',
        'Monthly performance incentives'
      ];

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...textColor);
      compensationPoints.forEach(point => {
        doc.text('• ' + point, 25, yPos);
        yPos += 6;
      });

      yPos += 5;

      // Comprehensive Support System
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('✓ COMPREHENSIVE SUPPORT SYSTEM', 20, yPos);
      yPos += 10;

      const supportPoints = [
        'Dedicated relationship manager assigned to your account',
        '24/7 technical support and troubleshooting',
        'Complete sales and marketing resources library',
        'Professional training and certification programs',
        'Regular webinars and skill development sessions'
      ];

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...textColor);
      supportPoints.forEach(point => {
        doc.text('• ' + point, 25, yPos);
        yPos += 6;
      });

      yPos += 5;

      // Transparent Pricing Protection
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('✓ TRANSPARENT PRICING PROTECTION', 20, yPos);
      yPos += 10;

      const pricingPoints = [
        'No hidden fees for your merchants',
        'Competitive interchange-plus pricing models',
        'Clear, straightforward contract terms',
        'Merchant protection guarantee program'
      ];

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...textColor);
      pricingPoints.forEach(point => {
        doc.text('• ' + point, 25, yPos);
        yPos += 6;
      });

      yPos += 5;

      // Cutting-Edge Technology
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('✓ CUTTING-EDGE TECHNOLOGY', 20, yPos);
      yPos += 10;

      const techPoints = [
        'Advanced payment processing solutions',
        'Mobile and online payment capabilities',
        'Point-of-sale system integrations',
        'Real-time reporting and analytics dashboard',
        'API integration support for developers'
      ];

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...textColor);
      techPoints.forEach(point => {
        doc.text('• ' + point, 25, yPos);
        yPos += 6;
      });

      // Page 3 - Partnership Opportunities
      doc.addPage();
      
      // Header
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 25, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text('PARTNERSHIP OPPORTUNITIES', 105, 15, { align: 'center' });

      yPos = 40;

      // Agent Program
      doc.setFillColor(...lightGray);
      doc.roundedRect(20, yPos - 5, 170, 55, 2, 2, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('AGENT PROGRAM', 25, yPos + 5);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...textColor);
      doc.text('Perfect for sales professionals', 25, yPos + 15);

      const agentPoints = [
        'Quick application approval process',
        'Immediate access to competitive rates',
        'Complete marketing materials provided',
        'Monthly residual payments',
        'Sales training and support'
      ];

      agentPoints.forEach((point, index) => {
        doc.text('• ' + point, 30, yPos + 25 + (index * 5));
      });

      yPos += 65;

      // ISO Program
      doc.setFillColor(...lightGray);
      doc.roundedRect(20, yPos - 5, 170, 55, 2, 2, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('ISO PROGRAM', 25, yPos + 5);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...textColor);
      doc.text('For established sales organizations', 25, yPos + 15);

      const isoPoints = [
        'Custom pricing programs',
        'White-label solutions available',
        'Sub-agent management tools',
        'Portfolio growth support',
        'Revenue sharing opportunities'
      ];

      isoPoints.forEach((point, index) => {
        doc.text('• ' + point, 30, yPos + 25 + (index * 5));
      });

      yPos += 65;

      // ISV Program
      doc.setFillColor(...lightGray);
      doc.roundedRect(20, yPos - 5, 170, 55, 2, 2, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('ISV PROGRAM', 25, yPos + 5);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...textColor);
      doc.text('For software integrators', 25, yPos + 15);

      const isvPoints = [
        'Developer-friendly APIs',
        'Technical integration support',
        'Revenue sharing opportunities',
        'Ongoing development resources',
        'Certification programs'
      ];

      isvPoints.forEach((point, index) => {
        doc.text('• ' + point, 30, yPos + 25 + (index * 5));
      });

      // Page 4 - Getting Started
      doc.addPage();
      
      // Header
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 25, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text('GET STARTED TODAY', 105, 15, { align: 'center' });

      yPos = 40;

      // Contact Information
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('CONTACT OUR PARTNERSHIP TEAM', 20, yPos);
      yPos += 15;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(...textColor);
      doc.text('📧 Email: partners@waveline.com', 25, yPos);
      yPos += 10;
      doc.text('📞 Phone: 1-800-WAVELINE', 25, yPos);
      yPos += 10;
      doc.text('🌐 Website: www.waveline.com/partners', 25, yPos);
      yPos += 20;

      // Application Process
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('APPLICATION PROCESS', 20, yPos);
      yPos += 15;

      const processSteps = [
        '1. Submit your partnership application online',
        '2. Complete background and financial verification',
        '3. Attend orientation and training session',
        '4. Receive your sales materials and portal access',
        '5. Start selling with full support from day one'
      ];

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(...textColor);
      processSteps.forEach(step => {
        doc.text(step, 25, yPos);
        yPos += 8;
      });

      yPos += 10;

      // Success Tips
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('TIPS FOR SUCCESS', 20, yPos);
      yPos += 15;

      const successTips = [
        '• Focus on building long-term relationships with merchants',
        '• Utilize all available training and support resources',
        '• Stay updated on industry trends and regulations',
        '• Leverage our marketing materials and tools',
        '• Maintain regular communication with your relationship manager'
      ];

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...textColor);
      successTips.forEach(tip => {
        doc.text(tip, 25, yPos);
        yPos += 7;
      });

      // Footer
      doc.setFillColor(...primaryColor);
      doc.rect(0, 270, 210, 27, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text('Building Success Together Since Day One', 105, 285, { align: 'center' });

      // Add page numbers
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...textColor);
        doc.text(`Page ${i} of ${totalPages}`, 190, 290, { align: 'right' });
      }

      // Save the PDF
      doc.save('Waveline-Partnership-Guide.pdf');
      console.log('PDF generated and downloaded successfully');

    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to text download if PDF generation fails
      const content = `
WAVELINE PARTNERSHIP PROGRAM
Your Gateway to Payment Processing Success

For detailed information, please visit our website or contact our partnership team.
Email: partners@waveline.com
Phone: 1-800-WAVELINE
Website: www.waveline.com/partners
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Waveline-Partnership-Guide.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      <Navbar />
      
      <div className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <FileText className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-orange-500 mb-6">
                Partnership Program Guide
              </h1>
              <p className="text-xl text-[#0EA5E9] max-w-2xl mx-auto">
                Download our comprehensive guide with detailed information about joining Waveline's partner network and building a successful payment processing business.
              </p>
            </div>
            
            <Button 
              onClick={handleDownload}
              className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white px-8 py-4 text-lg rounded-lg shadow-lg"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Professional PDF Guide
            </Button>
          </div>
        </section>

        {/* Preview of Guide Contents */}
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-orange-500 mb-12 text-center">What's Inside the Professional Guide</h2>
            
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
              Download the complete professional guide and take the first step towards building a successful payment processing business with Waveline.
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
