
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CertificateProps {
  name: string;
  lessonTitle: string;
  date: string;
  score: number;
}

const Certificate: React.FC<CertificateProps> = ({ name, lessonTitle, date, score }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Use supported badge variants
  const getBadgeVariant = (score: number) => {
    if (score >= 90) return "secondary"; // Success badge
    if (score >= 75) return "default";   // Info badge
    if (score >= 60) return "outline";   // Warning badge
    return "destructive";                // Already valid variant
  };
  
  // Custom class for better visual representation
  const getBadgeClass = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800"; 
    if (score >= 75) return "bg-blue-100 text-blue-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return ""; // Use default destructive style
  };
  
  const handleDownload = () => {
    // Here you would implement certificate PDF generation and download
    // This is a placeholder for now
    alert('Certificate download functionality will be implemented soon!');
  };
  
  return (
    <Card className="border-4 border-gray-200 max-w-2xl mx-auto">
      <CardHeader className="text-center border-b pb-6">
        <div className="flex justify-center mb-4">
          <Award className="h-16 w-16 text-yellow-500" />
        </div>
        <CardTitle className="text-3xl font-bold text-gray-800">Certificate of Completion</CardTitle>
        <CardDescription className="text-lg mt-2">
          This certifies that
        </CardDescription>
        <div className="text-2xl font-semibold text-[#0EA5E9] mt-1">{name}</div>
      </CardHeader>
      
      <CardContent className="pt-6 text-center space-y-4">
        <p className="text-lg">
          has successfully completed the training module
        </p>
        
        <div className="text-xl font-semibold text-gray-800 py-2">
          "{lessonTitle}"
        </div>
        
        <div className="flex justify-center items-center gap-3">
          <span>with a score of</span>
          <Badge 
            variant={getBadgeVariant(score)} 
            className={`text-md px-3 py-1 ${getBadgeClass(score)}`}
          >
            {score}%
          </Badge>
        </div>
        
        <div className="pt-6 text-gray-500">
          Completed on {formattedDate}
        </div>
        
        <div className="mt-8">
          <Button 
            className="flex items-center gap-2"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            Download Certificate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Certificate;
