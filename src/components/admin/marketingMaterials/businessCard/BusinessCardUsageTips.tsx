
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Printer, Users, Target } from 'lucide-react';

export const BusinessCardUsageTips: React.FC = () => {
  const tips = [
    {
      icon: Printer,
      title: "Print Quality",
      description: "Use high-quality cardstock (14pt or heavier) for professional feel",
      color: "orange"
    },
    {
      icon: Users,
      title: "Networking Events",
      description: "Perfect for trade shows, conferences, and client meetings",
      color: "teal"
    },
    {
      icon: Target,
      title: "Follow-Up Tool",
      description: "Include with proposals and leave-behind materials",
      color: "blue"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'orange':
        return {
          bg: 'from-orange-50 to-orange-100',
          border: 'border-orange-200',
          iconBg: 'bg-orange-500',
          textTitle: 'text-orange-900',
          textDesc: 'text-orange-700'
        };
      case 'teal':
        return {
          bg: 'from-teal-50 to-teal-100',
          border: 'border-teal-200',
          iconBg: 'bg-teal-500',
          textTitle: 'text-teal-900',
          textDesc: 'text-teal-700'
        };
      default:
        return {
          bg: 'from-blue-50 to-blue-100',
          border: 'border-blue-200',
          iconBg: 'bg-blue-500',
          textTitle: 'text-blue-900',
          textDesc: 'text-blue-700'
        };
    }
  };

  return (
    <Card className="border-2 border-gray-200 hover:border-orange-200 transition-colors duration-200">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
        <CardTitle className="flex items-center gap-3 text-gray-800">
          <div className="p-2 bg-orange-500 rounded-lg">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          Usage Tips & Best Practices
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid gap-4">
          {tips.map((tip, index) => {
            const colors = getColorClasses(tip.color);
            const IconComponent = tip.icon;
            
            return (
              <div 
                key={index}
                className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${colors.bg} p-4 ${colors.border} border`}
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-10 rounded-full transform translate-x-8 -translate-y-8"></div>
                
                <div className="flex items-start gap-4 relative z-10">
                  <div className={`flex-shrink-0 w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${colors.textTitle} mb-1`}>{tip.title}</h4>
                    <p className={`${colors.textDesc} text-sm leading-relaxed`}>{tip.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-yellow-900 font-medium text-sm">Pro Tip:</p>
              <p className="text-yellow-800 text-sm">Always customize your card before downloading. Include your direct contact information to maximize lead conversion.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
