
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, Globe, MapPin } from 'lucide-react';

interface BusinessCardData {
  name: string;
  title: string;
  phone: string;
  email: string;
  website: string;
}

interface BusinessCardPreviewProps {
  cardData: BusinessCardData;
}

export const BusinessCardPreview: React.FC<BusinessCardPreviewProps> = ({ cardData }) => {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="font-bold text-xl text-gray-800">Live Preview</h3>
        <p className="text-gray-600 text-sm">See how your business card will look</p>
      </div>
      
      <Card className="overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
        <CardContent className="p-0">
          {/* Front side of business card */}
          <div className="relative h-64 bg-gradient-to-br from-orange-500 via-orange-600 to-teal-500 text-white">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-300 opacity-20 rounded-full transform -translate-x-12 translate-y-12"></div>
            
            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
              {/* Header with logo */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-2xl">WaveLine</div>
                  <div className="text-orange-200 text-sm">~~~</div>
                </div>
                <div className="text-right text-xs text-orange-200">
                  Payment Solutions
                </div>
              </div>
              
              {/* Agent information */}
              <div className="space-y-1">
                <h2 className="text-xl font-bold">
                  {cardData.name || 'Your Name'}
                </h2>
                <p className="text-orange-200 font-medium">
                  {cardData.title || 'Sales Representative'}
                </p>
              </div>
              
              {/* Contact info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-orange-200" />
                  <span>{cardData.phone || '(555) 123-4567'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-orange-200" />
                  <span>{cardData.email || 'your.email@wavelinepayments.com'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-orange-200" />
                  <span>{cardData.website || 'www.wavelinepayments.com'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Back side preview hint */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 text-center border-t">
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Back side includes:</span> Company info, services overview, and QR code
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
