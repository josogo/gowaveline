
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Edit, FileText, Loader2 } from 'lucide-react';

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
      <h3 className="font-semibold text-lg">Features & Benefits</h3>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
          <FileText className="h-5 w-5 text-orange-600" />
          <div>
            <p className="font-medium text-orange-900">Professional Design</p>
            <p className="text-sm text-orange-700">Consistent branding with company logo and colors</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Edit className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-medium text-blue-900">Fully Customizable</p>
            <p className="text-sm text-blue-700">Add your name, title, phone, and email</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <Download className="h-5 w-5 text-green-600" />
          <div>
            <p className="font-medium text-green-900">Print Ready</p>
            <p className="text-sm text-green-700">High-quality HTML template for professional printing</p>
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
          Customize Card
        </Button>
        
        <Button 
          onClick={onDownload}
          disabled={isGenerating}
          className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white"
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
