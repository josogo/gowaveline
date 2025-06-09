
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Users, Target, MessageSquare, Phone, BookOpen } from 'lucide-react';

const tips = [
  {
    icon: BookOpen,
    title: 'Know Your Material',
    description: 'Study the one-pagers so you\'re fluent in the key points',
    details: [
      'Don\'t just hand over a flyer - converse around it',
      'Understand pain points for each industry',
      'Be able to talk through each bullet point confidently',
      'Example: "I know online gun dealers get dropped by PayPal - we solve that"'
    ]
  },
  {
    icon: Target,
    title: 'Target the Right Audience',
    description: 'Use industry-specific flyers to tailor your approach',
    details: [
      'CBD retailer? Bring the CBD flyer + general overview',
      'Adult business? Use the adult industry flyer',
      'Shows you understand their business and came prepared',
      'Builds trust from the first interaction'
    ]
  },
  {
    icon: Users,
    title: 'Emphasize Partnership',
    description: 'High-risk merchants need partners, not just vendors',
    details: [
      'Use friendly, informal tone - we\'re different from banks',
      'Say "we\'re here to be your partner, not just a vendor"',
      'Build rapport through empathy',
      'Example: "I get that you\'ve had a rough time with processors"'
    ]
  },
  {
    icon: MessageSquare,
    title: 'Use Materials as Conversation Tools',
    description: 'Walk through the materials with prospects when possible',
    details: [
      'Don\'t just leave PDFs behind - discuss them',
      'Point to specific items: "See here - no reserves, no sudden holds"',
      'Give visual reinforcement to your verbal pitch',
      'Engage prospects - they might ask questions (great sign!)'
    ]
  },
  {
    icon: Phone,
    title: 'Leave Behind and Follow Up',
    description: 'Always leave materials and maintain contact',
    details: [
      'Leave relevant one-pager + business card',
      'Materials help them recall highlights after you leave',
      'Follow up within a few days with friendly check-in',
      'High-risk merchants often have urgent needs - be timely'
    ]
  },
  {
    icon: Lightbulb,
    title: 'Stay Informed',
    description: 'Keep up with industry changes and regulations',
    details: [
      'Read company newsletters and industry news',
      'Stay current on regulations affecting CBD, firearms, etc.',
      'Knowledge of new laws/policies adds value',
      'Shows merchants they have a knowledgeable partner'
    ]
  }
];

export const AgentTips: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-800">Making the Most of These Materials</CardTitle>
          <CardDescription className="text-orange-700">
            Having great marketing materials is only part of the equation - how you use them in the field determines your success
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tips.map((tip, index) => {
          const IconComponent = tip.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 rounded-lg bg-orange-500 text-white">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  {tip.title}
                </CardTitle>
                <CardDescription>
                  {tip.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2">
                  {tip.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-orange-500 mt-1 text-xs">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Winning Formula</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-blue-700 space-y-4">
            <p className="text-lg font-medium">
              Marketing Materials + Personal Touch + Industry Knowledge = Success
            </p>
            <p>
              We provide the talking points and leave-behinds - you provide the human connection and trust. 
              Together, that's a winning formula for growing your portfolio and helping merchants find the 
              payment processing home they've been searching for.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
