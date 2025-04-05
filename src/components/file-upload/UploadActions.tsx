
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Loader2 } from 'lucide-react';

interface UploadActionsProps {
  uploading: boolean;
  file: File | null;
  onSend: () => Promise<void>;
  onAnalyze: () => Promise<void>;
  className?: string;
}

const UploadActions: React.FC<UploadActionsProps> = ({ uploading, file, onSend, onAnalyze, className }) => {
  return (
    <div className={`flex gap-4 justify-end ${className}`}>
      <Button 
        onClick={onSend} 
        disabled={uploading || !file}
        className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white"
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Send Statement
          </>
        )}
      </Button>
      <Button 
        onClick={onAnalyze} 
        disabled={uploading || !file}
        className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80 text-white"
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : 'Analyze Statement'}
      </Button>
    </div>
  );
};

export default UploadActions;
