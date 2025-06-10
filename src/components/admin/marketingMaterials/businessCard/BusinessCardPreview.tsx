
import React from 'react';

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
      <h3 className="font-semibold text-lg">Template Preview</h3>
      
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-6 rounded-lg text-white shadow-lg">
        <div className="flex flex-col h-32">
          <div className="flex items-center justify-between">
            <img 
              src="/lovable-uploads/1e017aad-3d36-4922-992f-f27b55733ec4.png" 
              alt="Company Logo" 
              className="h-8 w-auto"
            />
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <p className="text-sm font-medium opacity-90">
              Your Partner in High-Risk Merchant Services
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white border-2 border-gray-200 p-6 rounded-lg shadow-lg">
        <div className="space-y-2">
          <h4 className="font-bold text-lg text-gray-900">
            {cardData.name || '[Your Name]'}
          </h4>
          <p className="text-gray-600">
            {cardData.title || '[Your Title]'}
          </p>
          <div className="pt-2 space-y-1 text-sm text-gray-700">
            <p>📞 {cardData.phone || '[Your Phone Number]'}</p>
            <p>✉️ {cardData.email || '[Your Email]'}</p>
            <p>🌐 {cardData.website || '[Company Website]'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
