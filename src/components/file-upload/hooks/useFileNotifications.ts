
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { analyzeStatement } from '@/services/statementService';
import { sendEmailNotification } from '@/services/notificationService';
import { ContactInfo } from '../types';

export const useFileNotifications = () => {
  const navigate = useNavigate();

  const handleAnalyzeOperation = async (file: File, setProgress: (progress: number) => void) => {
    localStorage.removeItem('statementAnalysis');
    
    try {
      const onProgressUpdate = (value: number) => {
        console.log("Progress update:", value);
        setProgress(value);
      };
      
      const analysisData = await analyzeStatement(file, onProgressUpdate);
      console.log("Analysis complete:", analysisData);
      
      localStorage.setItem('statementAnalysis', JSON.stringify(analysisData));
      
      if (!analysisData.success) {
        toast.error(analysisData.message || "Analysis failed. Please try a different file format.");
        return false;
      }
      
      const hasAnyData = 
        analysisData.effectiveRate !== "N/A" || 
        analysisData.monthlyVolume !== "N/A" || 
        analysisData.pricingModel !== "N/A";
      
      if (hasAnyData) {
        toast.success("Analysis complete!");
      } else {
        toast.warning("Limited data extracted. Try uploading a clearer PDF or CSV version.");
      }
      
      navigate('/results');
      return true;
      
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("There was a problem analyzing your statement. Please try again.");
      return false;
    }
  };

  const handleSendOperation = async (file: File, contactInfo?: ContactInfo) => {
    toast.loading("Sending statement to WaveLine team...");
    
    try {
      const timeStamp = new Date().getTime();
      const fileName = `${timeStamp}_${file.name}`;
      
      await sendEmailNotification(file, contactInfo);
      
      toast.success("Statement sent successfully to the WaveLine team!");
      return true;
      
    } catch (error) {
      console.error("Send operation error:", error);
      toast.error("Failed to send statement. Please try again or contact support.");
      return false;
    } finally {
      toast.dismiss();
    }
  };

  return {
    sendNotification: {
      handleAnalyzeOperation,
      handleSendOperation
    }
  };
};
