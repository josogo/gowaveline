
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, FileText, Cannabis, ShieldCheck, Zap, Cigarette, Target } from 'lucide-react';

const materials = [
  {
    id: 'general',
    title: 'High-Risk Merchant Services Overview',
    description: 'General one-pager introducing merchants to our high-risk payment processing solutions',
    icon: Target,
    category: 'General',
    color: 'bg-blue-500',
    keyPoints: [
      'Why "High-Risk" Merchant Accounts Exist',
      'Challenges with Mainstream Processors',
      'Our High-Risk Expertise & Approval Network',
      'Benefits of Choosing Our Services'
    ]
  },
  {
    id: 'cbd',
    title: 'CBD Industry Solutions',
    description: 'Tailored for CBD and hemp product merchants addressing specific industry pain points',
    icon: Cannabis,
    category: 'Industry Specific',
    color: 'bg-green-500',
    keyPoints: [
      'Specialized High-Risk Approval',
      'Compliance Support',
      'Stable Processing, No Freezes',
      'Competitive Rates for CBD'
    ]
  },
  {
    id: 'adult',
    title: 'Adult Entertainment Solutions',
    description: 'For adult content websites, subscription platforms, and adult product retailers',
    icon: ShieldCheck,
    category: 'Industry Specific',
    color: 'bg-purple-500',
    keyPoints: [
      'No Judgement, We Welcome Adult Businesses',
      'High Approval Rates via Multiple Banks',
      'Discreet Billing & Customer Privacy',
      'Recurring Billing & Subscription Support'
    ]
  },
  {
    id: 'firearms',
    title: 'Firearms & Ammunition Solutions',
    description: 'Gun-friendly credit card processing for firearms, ammunition, and related businesses',
    icon: Target,
    category: 'Industry Specific',
    color: 'bg-red-500',
    keyPoints: [
      'Proudly Serving Firearm Businesses',
      'Secure, Compliant Processing',
      'No More Unfair Terminations',
      'Full Spectrum of Payment Solutions'
    ]
  },
  {
    id: 'vape',
    title: 'Vape & E-Cigarette Solutions',
    description: 'Supporting vape shops and e-cigarette businesses with specialized payment processing',
    icon: Cigarette,
    category: 'Industry Specific',
    color: 'bg-gray-500',
    keyPoints: [
      'Vape-Friendly Processing from Day One',
      'No Surprise Freezes or Holds',
      'Compliance with Regulations',
      'Multiple Sales Channels Supported'
    ]
  }
];

export const MaterialsGrid: React.FC = () => {
  const handleDownload = (materialId: string) => {
    // This would trigger the download of the PDF
    console.log('Downloading material:', materialId);
  };

  const handlePreview = (materialId: string) => {
    // This would open a preview modal
    console.log('Previewing material:', materialId);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {materials.map((material) => {
          const IconComponent = material.icon;
          return (
            <Card key={material.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${material.color} text-white`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{material.title}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {material.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-3">
                  {material.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Key Points Covered:</h4>
                  <ul className="space-y-1">
                    {material.keyPoints.map((point, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={() => handlePreview(material.id)}
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button 
                    onClick={() => handleDownload(material.id)}
                    size="sm"
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <FileText className="h-5 w-5" />
            How to Use These Materials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <h4 className="font-medium mb-2">General Overview Flyer:</h4>
              <p>Great for any high-risk prospect. Use as a leave-behind or talking point when first discussing our services.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Industry-Specific Flyers:</h4>
              <p>Ideal when approaching specific industry merchants. Speaks their language and addresses their unique frustrations.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
