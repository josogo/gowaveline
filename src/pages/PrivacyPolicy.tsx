
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-[#0EA5E9] mb-8">Privacy Policy</h1>
          <div className="prose prose-lg max-w-none">
            <p className="mb-6">Last Updated: April 4, 2025</p>
            
            <h2 className="text-2xl font-semibold text-[#0EA5E9] mt-8 mb-4">Introduction</h2>
            <p>
              At Waveline, we respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and safeguard your information when you 
              visit our website or use our services.
            </p>
            
            <h2 className="text-2xl font-semibold text-[#0EA5E9] mt-8 mb-4">Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, such as when you:
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Submit a merchant statement for analysis</li>
              <li>Contact us through our website</li>
              <li>Sign up for our newsletter</li>
              <li>Create an account on our platform</li>
            </ul>
            <p>
              This information may include your name, email address, phone number, company name, 
              and payment processing details from your merchant statements.
            </p>
            
            <h2 className="text-2xl font-semibold text-[#0EA5E9] mt-8 mb-4">How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and analyze your merchant statements</li>
              <li>Communicate with you about our services</li>
              <li>Send you technical notices and updates</li>
              <li>Respond to your comments and questions</li>
              <li>Develop new products and services</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-[#0EA5E9] mt-8 mb-4">Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personally identifiable information 
              to third parties without your consent, except as described below:
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>With service providers who perform services on our behalf</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and the rights of others</li>
              <li>In connection with a business transfer or acquisition</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-[#0EA5E9] mt-8 mb-4">Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal 
              data against unauthorized or unlawful processing, accidental loss, destruction, or damage.
            </p>
            
            <h2 className="text-2xl font-semibold text-[#0EA5E9] mt-8 mb-4">Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal data, including:
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Access to your personal data</li>
              <li>Correction of inaccurate data</li>
              <li>Deletion of your data</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-[#0EA5E9] mt-8 mb-4">Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our data practices, please contact us at:
            </p>
            <p className="my-4">
              <strong>Email:</strong> privacy@gowaveline.com<br />
              <strong>Phone:</strong> (805) 586-3591<br />
              <strong>Address:</strong> 123 Payment Processing Way, Suite 400, Financial District, CA 90210
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
