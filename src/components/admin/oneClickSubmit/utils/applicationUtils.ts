
import { ApplicationListItem } from "../hooks/useApplications";

/**
 * Calculate the progress of an application based on completed tabs
 */
export function calculateProgress(applicationData: any): number {
  if (!applicationData) return 0;
  
  // If progress is already calculated, return it
  if (applicationData.progress) {
    return applicationData.progress;
  }
  
  // Count tabs with data
  const tabs = ['business', 'ownership', 'operations', 'marketing', 'financial', 'processing', 'documents'];
  const completedTabs = tabs.filter(tab => !!applicationData[tab]);
  
  // Calculate percentage
  return Math.round((completedTabs.length / tabs.length) * 100);
}

/**
 * Generate mock applications for development/demo purposes
 */
export function generateMockApplications(): ApplicationListItem[] {
  // Mock data generated here
  return [
    {
      id: '1',
      businessName: 'Example Business',
      status: 'incomplete',
      lastEdited: new Date().toISOString(),
      progress: 42,
    },
    {
      id: '2',
      businessName: 'Test Company LLC',
      status: 'complete',
      lastEdited: new Date(Date.now() - 86400000).toISOString(),
      progress: 100,
    },
  ] as ApplicationListItem[];
}

/**
 * Format application data from database to the format used in the UI
 */
export function formatApplicationData(app: any): ApplicationListItem {
  let businessName = app.merchant_name;
  let progress = 0;
  
  // Extract business name from application data if available
  if (app.application_data) {
    // Try to use the business name from the application data
    if (app.application_data.business?.businessName) {
      businessName = app.application_data.business.businessName;
    }
    
    // Try to use stored progress or calculate it
    progress = app.application_data.progress || calculateProgress(app.application_data);
  }
  
  return {
    id: app.id,
    businessName: businessName || 'Unnamed Business',
    status: app.status || (app.completed ? 'complete' : 'incomplete'),
    lastEdited: app.updated_at || app.created_at,
    progress: progress,
    rawData: app, // Store the original data for reference
  };
}
