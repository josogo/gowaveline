
/**
 * Utility functions for Applications logic.
 */

/**
 * Calculate percent completion for application form fields.
 * @param applicationData - The application data to analyze
 * @returns Percentage of completion (0-100)
 */
export function calculateProgress(applicationData: any): number {
  if (!applicationData) return 0;
  
  // Parse the application data if it's a string
  const appData = typeof applicationData === "string"
    ? JSON.parse(applicationData)
    : applicationData;
    
  // Count filled fields (approximately 20 fields total across all tabs)
  const totalFields = 20;
  const filledFields = appData ? Object.keys(appData).length : 0;
  
  // Return percentage with max of 100%
  return Math.min(100, Math.round((filledFields / totalFields) * 100));
}

/**
 * Provide mock application items for offline/failed loading.
 * @returns Array of mock application data
 */
export function generateMockApplications() {
  return [
    {
      id: "1",
      businessName: "Acme CBD Wellness",
      status: "complete" as const,
      lastEdited: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      progress: 100,
    },
    {
      id: "2",
      businessName: "Natural Supplements Co.",
      status: "incomplete" as const,
      lastEdited: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 65,
    },
    {
      id: "3",
      businessName: "FitLife Subscription",
      status: "incomplete" as const,
      lastEdited: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 30,
    },
  ];
}

/**
 * Format the application data for display
 * @param app - Raw application data
 * @returns Formatted application data
 */
export function formatApplicationData(app: any) {
  // Extract business name from application data
  let businessName = "Unknown Business";
  if (app.application_data) {
    const appData = typeof app.application_data === "string"
      ? JSON.parse(app.application_data)
      : app.application_data;
    businessName = appData?.businessName || app.merchant_name || "Unknown Business";
  } else if (app.merchant_name) {
    businessName = app.merchant_name;
  }
  
  // Map the status to one of the allowed values
  let status: "complete" | "incomplete" | "submitted" = "incomplete";
  if (app.completed) {
    status = "complete";
  }
  
  return {
    id: app.id,
    businessName,
    status,
    lastEdited: app.updated_at,
    progress: calculateProgress(app.application_data),
    rawData: app,
  };
}
