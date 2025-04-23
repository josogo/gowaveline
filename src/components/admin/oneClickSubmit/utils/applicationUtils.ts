
import { formatDistanceToNow } from 'date-fns';
import { ApplicationListItem } from '../hooks/useApplications';

export const formatApplicationData = (rawData: any): ApplicationListItem => {
  // Get business name from different possible sources
  const businessName = rawData.merchant_name || 
                        rawData.application_data?.business?.businessName || 
                        "Unnamed Business";

  // Calculate progress - either from stored value or default to 0
  const progress = rawData.application_data?.progress || 0;

  // Determine status based on different factors
  let status: ApplicationListItem["status"] = "incomplete";
  if (rawData.status === "declined") {
    status = "declined";
  } else if (rawData.status === "removed") {
    status = "removed";
  } else if (rawData.completed) {
    status = "complete";
  } else if (progress === 100) {
    status = "submitted";
  }

  return {
    id: rawData.id,
    businessName,
    status,
    lastEdited: rawData.updated_at || rawData.created_at,
    progress,
    rawData, // Include the raw data for reference
  };
};

export const calculateProgress = (applicationData: any) => {
  if (!applicationData) return 0;
  
  // If the application already has a progress value, return it
  if (applicationData.progress) return applicationData.progress;
  
  // Otherwise calculate based on completion of sections
  const sections = [
    'business',
    'ownership',
    'operations',
    'marketing',
    'financial',
    'processing',
    'documents'
  ];
  
  const completedSections = sections.filter(section => 
    applicationData[section] && Object.keys(applicationData[section]).length > 0
  );
  
  return Math.round((completedSections.length / sections.length) * 100);
};

export const generateMockApplications = () => {
  return [
    {
      id: '1',
      businessName: 'ACME Corp',
      status: 'incomplete' as const,
      lastEdited: new Date().toString(),
      progress: 30,
      rawData: {
        id: '1',
        merchant_name: 'ACME Corp',
        application_data: {
          progress: 30,
          business: { businessName: 'ACME Corp' }
        },
        updated_at: new Date().toString(),
      }
    },
    {
      id: '2',
      businessName: 'XYZ Industries',
      status: 'complete' as const,
      lastEdited: new Date(Date.now() - 86400000).toString(), // 1 day ago
      progress: 100,
      rawData: {
        id: '2',
        merchant_name: 'XYZ Industries',
        completed: true,
        application_data: {
          progress: 100,
          business: { businessName: 'XYZ Industries' }
        },
        updated_at: new Date(Date.now() - 86400000).toString(),
      }
    }
  ];
};
