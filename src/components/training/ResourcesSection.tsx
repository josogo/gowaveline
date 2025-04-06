
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, MessageCircle, Book } from 'lucide-react';

interface ResourceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  items: string[];
}

const ResourcesSection: React.FC = () => {
  // Resources Data
  const resources: ResourceItem[] = [
    {
      title: 'Sales Scripts',
      description: 'Ready-to-use scripts for different sales scenarios',
      icon: <MessageCircle className="h-5 w-5 text-orange-500" />,
      items: [
        'Cold Call Script.pdf',
        'Pricing Objection Handling.doc',
        'Contract Renewal Dialog.pdf',
        'Competitor Switch Script.doc',
        'High-Volume Merchant Pitch.pdf'
      ]
    },
    {
      title: 'Statement Analysis',
      description: 'Tools and templates for statement review',
      icon: <FileText className="h-5 w-5 text-[#0EA5E9]" />,
      items: [
        'Statement Analysis Worksheet.xlsx',
        'Fee Identification Guide.pdf',
        'Savings Calculator Template.xlsx',
        'Competitor Comparison Tool.pdf',
        'Hidden Fees Cheatsheet.pdf'
      ]
    },
    {
      title: 'Training Materials',
      description: 'Educational resources and reference guides',
      icon: <Book className="h-5 w-5 text-green-500" />,
      items: [
        'Payment Processing Handbook.pdf',
        'Interchange Categories Guide.pdf',
        'High-Risk Industry Guidelines.doc',
        'PCI Compliance Checklist.pdf',
        'Equipment Comparison Guide.xlsx'
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 mb-2">
              {resource.icon}
              <CardTitle className="text-lg">{resource.title}</CardTitle>
            </div>
            <CardDescription>{resource.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {resource.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-blue-600 cursor-pointer hover:underline">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ResourcesSection;
