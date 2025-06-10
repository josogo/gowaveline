
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Edit, FileText, Loader2, Zap, Shield } from 'lucide-react';

interface BusinessCardFeaturesProps {
  onCustomize: () => void;
  onDownload: () => void;
  isGenerating: boolean;
}

export const BusinessCardFeatures: React.FC<BusinessCardFeaturesProps> = ({
  onCustomize,
  onDownload,
  isGenerating
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="font-bold text-2xl text-gray-800">Professional Business Cards</h3>
        <p className="text-gray-600">Ready-to-print templates with WaveLine branding</p>
      </div>
      
      <div className="grid gap-4">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 p-6 border border-orange-200">
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500 rounded-full opacity-10 transform translate-x-8 -translate-y-8"></div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-orange-900 mb-2">Professional Design</h4>
              <p className="text-orange-700 text-sm leading-relaxed">Consistent branding with company logo, colors, and professional typography</p>
            </div>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-teal-50 to-teal-100 p-6 border border-teal-200">
          <div className="absolute top-0 right-0 w-20 h-20 bg-teal-500 rounded-full opacity-10 transform translate-x-8 -translate-y-8"></div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center">
              <Edit className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-teal-900 mb-2">Fully Customizable</h4>
              <p className="text-teal-700 text-sm leading-relaxed">Add your name, title, contact information, and personal branding</p>
            </div>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 p-6 border border-blue-200">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 rounded-full opacity-10 transform translate-x-8 -translate-y-8"></div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Download className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">Print Ready HTML</h4>
              <p className="text-blue-700 text-sm leading-relaxed">High-quality HTML template optimized for professional printing</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button 
          onClick={onCustomize}
          variant="outline"
          className="flex-1 border-2 border-teal-500 text-teal-600 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-600 transition-all duration-200"
        >
          <Edit className="h-4 w-4 mr-2" />
          Customize Card
        </Button>
        
        <Button 
          onClick={onDownload}
          disabled={isGenerating}
          className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
