
import React from 'react';
import { FileText, Download, Palette } from 'lucide-react';

export const MarketingHeader: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-teal-500 text-white p-8 mb-8">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full transform translate-x-20 -translate-y-20"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-300 opacity-20 rounded-full transform -translate-x-16 translate-y-16"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
            <Palette className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Marketing Materials</h1>
            <p className="text-orange-100 text-lg">Professional templates for your sales success</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-3 bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
            <FileText className="h-6 w-6 text-orange-200" />
            <div>
              <p className="font-semibold">Industry Templates</p>
              <p className="text-orange-100 text-sm">Tailored for each vertical</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
            <Download className="h-6 w-6 text-teal-200" />
            <div>
              <p className="font-semibold">Instant Download</p>
              <p className="text-teal-100 text-sm">PDF & HTML formats</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
            <Palette className="h-6 w-6 text-orange-200" />
            <div>
              <p className="font-semibold">Brand Consistent</p>
              <p className="text-orange-100 text-sm">WaveLine styling</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
