
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Users, Handshake } from 'lucide-react';
import { toast } from 'sonner';

const materialTemplates = [
  {
    id: 'general',
    title: 'High-Risk Merchant Services Overview',
    description: 'General introduction to high-risk payment processing solutions',
    icon: Handshake,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    content: {
      title: 'High-Risk Merchant Services',
      subtitle: 'Your Partner in Payment Processing Success',
      challenges: [
        'Traditional processors reject high-risk industries',
        'Mainstream providers like Stripe and PayPal often prohibit high-risk categories',
        'Sudden account closures leave merchants stranded',
        'Higher fees and strict terms from unsuitable processors'
      ],
      solutions: [
        'Specialized high-risk underwriting expertise',
        'Network of 20+ acquiring banking partners',
        '99% approval rate with 24-hour turnaround',
        'Stable processing without surprise holds',
        'Transparent, competitive pricing with no hidden fees',
        'Dedicated account management and support'
      ],
      industries: ['Adult Entertainment', 'Firearms', 'CBD', 'Vape/E-cigarettes', 'Online Gaming', 'Tobacco']
    }
  },
  {
    id: 'cbd',
    title: 'CBD Industry Solutions',
    description: 'Specialized payment processing for CBD and hemp businesses',
    icon: FileText,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    content: {
      title: 'CBD Payment Processing Solutions',
      subtitle: 'Compliant, Stable Processing for Hemp & CBD Merchants',
      challenges: [
        'Regulatory complexity despite 2018 Farm Bill legalization',
        'PayPal, Stripe, and Square prohibit CBD transactions',
        'Frequent account freezes and sudden shutdowns',
        'Limited payment options for legitimate CBD businesses'
      ],
      solutions: [
        'Specialized CBD compliance expertise',
        'Banking partners comfortable with hemp products',
        'No-freeze guarantee for stable cash flow',
        'Support for subscriptions and high-ticket sales',
        'Discreet billing descriptors available',
        'Fast approval process for CBD merchants'
      ],
      features: ['Age Verification', 'State Compliance', 'ACH Processing', 'Subscription Billing']
    }
  },
  {
    id: 'adult',
    title: 'Adult Entertainment Solutions',
    description: 'Discreet, reliable processing for adult industry businesses',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    content: {
      title: 'Adult Entertainment Payment Solutions',
      subtitle: 'Discreet, Professional Processing You Can Trust',
      challenges: [
        'Banks avoid adult businesses for reputational reasons',
        'Higher chargeback rates in adult industries',
        'Need for customer privacy and discretion',
        'Complex compliance requirements (age verification)'
      ],
      solutions: [
        'Discreet billing descriptors for customer privacy',
        'Robust subscription and membership billing',
        'High approval rates with specialized underwriting',
        'Global payment support with multi-currency',
        'Advanced fraud detection and chargeback tools',
        'No judgment - we welcome adult businesses'
      ],
      features: ['Discreet Billing', 'Recurring Payments', 'Age Verification', 'International Processing']
    }
  },
  {
    id: 'firearms',
    title: 'Firearms & Ammunition Solutions',
    description: 'Gun-friendly payment processing for FFL dealers and retailers',
    icon: FileText,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    content: {
      title: 'Firearms Payment Processing Solutions',
      subtitle: 'Second Amendment-Friendly Payment Solutions',
      challenges: [
        'Most processors refuse firearms businesses',
        'Complex federal and state regulations',
        'Banks avoid gun industry for image concerns',
        'Limited options for FFL dealers and retailers'
      ],
      solutions: [
        'Gun-friendly banking partnerships',
        'ATF and compliance expertise',
        'No arbitrary volume caps on ammunition sales',
        'Robust processing for high-ticket firearms',
        'Fraud tools and chargeback management',
        'Support for gun shows and mobile payments'
      ],
      features: ['FFL Compliance', 'Age Verification', 'Background Check Integration', 'High-Ticket Support']
    }
  },
  {
    id: 'vape',
    title: 'Vape & E-Cigarette Solutions',
    description: 'Specialized processing for vape shops and e-cigarette retailers',
    icon: FileText,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    content: {
      title: 'Vape & E-Cigarette Payment Solutions',
      subtitle: 'Reliable Processing for the Vaping Industry',
      challenges: [
        'Health concerns make vape businesses high-risk',
        'Evolving regulations and uncertain legal status',
        'High chargeback rates in vape industry',
        'Limited payment options from traditional processors'
      ],
      solutions: [
        'Vape-friendly banking partnerships',
        'Fast approval in under 48 hours',
        'Multiple payment options (cards, ACH, e-checks)',
        'Age verification and compliance tools',
        'Chargeback prevention and fraud detection',
        'Support for both online and retail vape shops'
      ],
      features: ['Age Verification', 'Fraud Prevention', 'Multiple Payment Types', 'Compliance Support']
    }
  }
];

export const MaterialsGrid: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const handleDownload = async (material: typeof materialTemplates[0]) => {
    setIsGenerating(material.id);
    
    try {
      const response = await fetch('/api/supabase/functions/v1/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'marketing-material',
          data: {
            materialType: material.id,
            content: material.content,
            companyInfo: {
              name: 'WaveLine',
              tagline: 'Your Partner in High-Risk Merchant Services',
              website: 'www.wavelinepayments.com',
              phone: '1-800-WAVELINE',
              email: 'info@wavelinepayments.com'
            }
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${material.title.replace(/\s+/g, '-').toLowerCase()}-one-pager.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`${material.title} PDF downloaded successfully!`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Industry-Specific One-Page PDFs</h2>
        <p className="text-gray-600">
          Professional marketing materials tailored for different high-risk industries. 
          Each one-pager addresses specific industry challenges and highlights our solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materialTemplates.map((material) => {
          const IconComponent = material.icon;
          const isLoading = isGenerating === material.id;
          
          return (
            <Card key={material.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 ${material.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                  <IconComponent className={`h-6 w-6 ${material.color}`} />
                </div>
                <CardTitle className="text-lg">{material.title}</CardTitle>
                <CardDescription>{material.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">Key Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {material.content.solutions.slice(0, 3).map((solution, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  onClick={() => handleDownload(material)}
                  disabled={isLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isLoading ? 'Generating...' : 'Download PDF'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">How to Use These Materials</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Target the Right Audience:</strong> Use industry-specific flyers when approaching prospects in those sectors.</p>
          <p><strong>Leave Behind:</strong> These PDFs are perfect leave-behinds after meetings or conversations.</p>
          <p><strong>Follow Up:</strong> Reference specific points from the flyer in your follow-up communications.</p>
          <p><strong>Print Quality:</strong> All PDFs are optimized for professional printing at 300 DPI.</p>
        </div>
      </div>
    </div>
  );
};
