
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AnalyticsData = {
  totalApplications: number;
  completedApplications: number;
  incompleteApplications: number;
  submittedApplications: number;
  declinedApplications: number;
  removedApplications: number;
  applicationsByStatus: { status: string; count: number }[];
  declineReasons: { reason: string; count: number }[];
  applicationTrend: { date: string; count: number }[];
  averageCompletionTime?: number;
  stepDropoffs?: { step: string; dropoff: number }[];
};

export function useAnalyticsData() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  async function fetchAnalyticsData() {
    setLoading(true);
    try {
      // Get date range based on the selected time range
      const now = new Date();
      let startDate;
      
      switch (timeRange) {
        case "week":
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          startDate = new Date(now);
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      const startDateString = startDate.toISOString();

      // Fetch all applications within the time range
      const { data: applicationsData, error: applicationsError } = await supabase
        .from("merchant_applications")
        .select("*")
        .gte("created_at", startDateString);

      if (applicationsError) throw applicationsError;

      // Fetch decline reasons from the action log
      const { data: declineLogData, error: declineLogError } = await supabase
        .from("applications_action_log")
        .select("*")
        .eq("action", "declined")
        .gte("actioned_at", startDateString);

      if (declineLogError) throw declineLogError;

      // Process applications by status
      const statusCounts = { 
        complete: 0, 
        incomplete: 0, 
        submitted: 0, 
        declined: 0,
        removed: 0
      };
      
      applicationsData.forEach(app => {
        if (app.status in statusCounts) {
          statusCounts[app.status as keyof typeof statusCounts]++;
        } else if (!app.status && !app.completed) {
          statusCounts.incomplete++;
        }
      });

      // Process decline reasons
      const reasonsMap = new Map<string, number>();
      declineLogData.forEach(log => {
        const reason = log.reason || "Unspecified";
        reasonsMap.set(reason, (reasonsMap.get(reason) || 0) + 1);
      });

      const declineReasons = Array.from(reasonsMap.entries()).map(([reason, count]) => ({
        reason,
        count,
      }));

      // Process application trend (grouped by day)
      const dateMap = new Map<string, number>();
      applicationsData.forEach(app => {
        const date = new Date(app.created_at).toISOString().split('T')[0];
        dateMap.set(date, (dateMap.get(date) || 0) + 1);
      });

      // Sort dates and ensure continuous date range
      let applicationTrend = Array.from(dateMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Calculate progress step dropoffs (simplified estimation)
      const stepDropoffs = [
        { step: "Business", dropoff: 0 },
        { step: "Ownership", dropoff: 0 },
        { step: "Processing", dropoff: 0 },
        { step: "Financial", dropoff: 0 },
        { step: "Documents", dropoff: 0 },
        { step: "Marketing", dropoff: 0 },
        { step: "Operations", dropoff: 0 }
      ];

      let stepCounts = [0, 0, 0, 0, 0, 0, 0];
      
      applicationsData.forEach(app => {
        // Fix: Check if application_data exists and is an object, then check if it has progress property
        if (app.application_data && 
            typeof app.application_data === 'object' && 
            'progress' in app.application_data && 
            typeof app.application_data.progress === 'number') {
          
          // Determine which step the application reached based on progress percentage
          const progress = app.application_data.progress;
          if (progress >= 14) stepCounts[0]++; // Business
          if (progress >= 28) stepCounts[1]++; // Ownership
          if (progress >= 42) stepCounts[2]++; // Processing
          if (progress >= 56) stepCounts[3]++; // Financial
          if (progress >= 70) stepCounts[4]++; // Documents
          if (progress >= 84) stepCounts[5]++; // Marketing
          if (progress >= 100) stepCounts[6]++; // Operations
        }
      });

      // Calculate dropoff percentages
      for (let i = 0; i < stepCounts.length - 1; i++) {
        if (stepCounts[i] > 0) {
          const dropoffPercentage = ((stepCounts[i] - stepCounts[i + 1]) / stepCounts[i]) * 100;
          stepDropoffs[i].dropoff = Math.round(dropoffPercentage);
        }
      }

      setAnalyticsData({
        totalApplications: applicationsData.length,
        completedApplications: statusCounts.complete,
        incompleteApplications: statusCounts.incomplete,
        submittedApplications: statusCounts.submitted,
        declinedApplications: statusCounts.declined,
        removedApplications: statusCounts.removed,
        applicationsByStatus: Object.entries(statusCounts).map(([status, count]) => ({
          status,
          count,
        })),
        declineReasons,
        applicationTrend,
        stepDropoffs
      });

    } catch (err: any) {
      console.error("Error fetching analytics data:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return {
    analyticsData,
    loading,
    error,
    timeRange,
    setTimeRange,
    refreshData: fetchAnalyticsData
  };
}
