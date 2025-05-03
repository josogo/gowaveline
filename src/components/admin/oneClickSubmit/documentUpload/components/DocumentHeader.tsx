
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Info } from 'lucide-react';

interface DocumentHeaderProps {
  isTemporaryMode: boolean;
  isLoading: boolean;
  onRefresh: () => void;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({ 
  isTemporaryMode, 
  isLoading, 
  onRefresh 
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between pb-3">
      <div>
        <CardTitle className="text-xl font-semibold">Document Collection</CardTitle>
        {isTemporaryMode && (
          <div className="mt-1 text-xs flex items-center text-amber-600 gap-1">
            <Info className="h-3 w-3" />
            <span>Documents are being stored temporarily.</span>
          </div>
        )}
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
        <span className="ml-1">Refresh</span>
      </Button>
    </CardHeader>
  );
};

export default DocumentHeader;
