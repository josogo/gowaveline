
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Edit } from 'lucide-react';

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
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Template Features</h3>
      
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
          <div>
            <h4 className="font-medium">Standard Business Card Design</h4>
            <p className="text-sm text-gray-600">3.5" x 2" standard size with front and back layouts</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
          <div>
            <h4 className="font-medium">Customizable Agent Info</h4>
            <p className="text-sm text-gray-600">Easy-to-edit fields for your contact details with live preview</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
          <div>
            <h4 className="font-medium">Print-Ready Format</h4>
            <p className="text-sm text-gray-600">High-resolution template with proper colors and margins</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
          <div>
            <h4 className="font-medium">Professional & Trust-Building</h4>
            <p className="text-sm text-gray-600">Establishes credibility from the first interaction</p>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 pt-4">
        <Button 
          onClick={onCustomize}
          variant="outline" 
          className="flex-1"
        >
          <Edit className="h-4 w-4 mr-2" />
          Customize
        </Button>
        <Button 
          onClick={onDownload}
          disabled={isGenerating}
          className="flex-1 bg-orange-500 hover:bg-orange-600"
        >
          <Download className="h-4 w-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Download Template'}
        </Button>
      </div>
    </div>
  );
};
