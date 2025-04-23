
/**
 * Utility functions for Applications logic.
 */

/**
 * Calculate percent completion for application form fields.
 */
export function calculateProgress(applicationData: any): number {
  if (!applicationData) return 0;
  const appData = typeof applicationData === "string"
    ? JSON.parse(applicationData)
    : applicationData;
  const totalFields = 20; // Estimate of total fields across all tabs
  const filledFields = appData ? Object.keys(appData).length : 0;
  return Math.min(100, Math.round((filledFields / totalFields) * 100));
}

/**
 * Provide mock application items for offline/failed loading.
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
