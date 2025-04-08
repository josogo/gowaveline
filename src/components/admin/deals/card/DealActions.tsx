
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { FileText, Edit, Upload, CheckCircle2 } from 'lucide-react';

interface DealActionsProps {
  dealStatus: string;
  onEdit: () => void;
  onUpload: () => void;
  onStatusChange: (status: 'pending' | 'closed' | 'lost') => void;
}

const DealActions: React.FC<DealActionsProps> = ({ 
  dealStatus, 
  onEdit, 
  onUpload, 
  onStatusChange 
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <FileText className="h-5 w-5 mr-2 text-orange-500" />
            Actions
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline"
            className="flex-1 flex items-center justify-center"
            onClick={onEdit}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button 
            variant="outline"
            className="flex-1 flex items-center justify-center"
            onClick={onUpload}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
        <div className="mt-3">
          <Button 
            className={`w-full ${dealStatus === 'closed' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-green-600 hover:bg-green-700 text-white'}`}
            disabled={dealStatus === 'closed'}
            onClick={() => onStatusChange('closed')}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Mark as Closed
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DealActions;
