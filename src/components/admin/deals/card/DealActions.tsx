
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { FileText, Edit, CheckCircle2 } from 'lucide-react';

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
    <Card className="shadow-sm border-orange-100">
      <CardHeader className="pb-2 bg-gradient-to-r from-orange-50 to-teal-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <FileText className="h-5 w-5 mr-2 text-orange-500" />
            Actions
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline"
            className="flex-1 flex items-center justify-center border-teal-200 hover:bg-teal-50"
            onClick={onEdit}
          >
            <Edit className="mr-2 h-4 w-4 text-teal-600" />
            Edit
          </Button>
        </div>
        <div className="mt-3">
          <Button 
            className={`w-full ${dealStatus === 'closed' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
            disabled={dealStatus === 'closed'}
            onClick={() => onStatusChange('closed')}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Deal Won
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DealActions;
