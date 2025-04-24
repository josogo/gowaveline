
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define the type for our analytics data
export interface AnalyticsData {
  totalApplications: number;
  completedApplications: number;
  declinedApplications: number;
  incompleteApplications: number;
  applicationsByStatus: Array<{ status: string; count: number }>;
  declineReasons: Array<{ reason: string; count: number }>;
  stepDropoffs: Array<{ step: string; dropoff: number }>;
  applicationTrend: Array<{ date: string; count: number }>;
  // Add any other data properties you need
}

// Define the type for time range
export type TimeRange = '7d' | '30d' | '90d' | 'all';

export function useAnalyticsData() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch user role and ID
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;
        
        setUserId(user.id);
        
        // Fetch user role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        if (roleError && roleError.code !== 'PGRST116') {
          console.error('Error fetching user role:', roleError);
        }
        
        if (roleData) {
          setUserRole(roleData.role);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  // Function to fetch analytics data with role-based filtering
  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let timeFilter;
      switch (timeRange) {
        case '7d':
          timeFilter = 'created_at >= now() - interval \'7 days\'';
          break;
        case '30d':
          timeFilter = 'created_at >= now() - interval \'30 days\'';
          break;
        case '90d':
          timeFilter = 'created_at >= now() - interval \'90 days\'';
          break;
        default:
          timeFilter = null;
      }

      // Base query parts
      const baseSelect = '*';
      let baseFrom = 'applications';
      let baseFilter = timeFilter ? timeFilter : '';
      
      // Add role-based filters
      if (userRole === 'sales_rep' && userId) {
        if (baseFilter) {
          baseFilter += ' AND ';
        }
        baseFilter += `assigned_rep = '${userId}'`;
      }
      
      // For demo purposes, let's create some mock analytics data
      // In a real application, you would query your Supabase database
      
      // Simulate fetching data with different results based on role and timeRange
      // This demonstrates the concept without requiring actual database queries
      
      // Mock data generation function
      const generateMockData = (): AnalyticsData => {
        // Adjust total applications based on role
        const totalApps = userRole === 'sales_rep' ? 48 : 237;
        const completedApps = userRole === 'sales_rep' ? 32 : 156;
        const declinedApps = userRole === 'sales_rep' ? 10 : 47;
        const incompleteApps = totalApps - completedApps - declinedApps;
        
        return {
          totalApplications: totalApps,
          completedApplications: completedApps,
          declinedApplications: declinedApps,
          incompleteApplications: incompleteApps,
          applicationsByStatus: [
            { status: 'complete', count: completedApps },
            { status: 'incomplete', count: incompleteApps },
            { status: 'declined', count: declinedApps }
          ],
          declineReasons: [
            { reason: 'Insufficient Documentation', count: userRole === 'sales_rep' ? 4 : 18 },
            { reason: 'Credit Issues', count: userRole === 'sales_rep' ? 3 : 12 },
            { reason: 'Business Type Not Supported', count: userRole === 'sales_rep' ? 2 : 9 },
            { reason: 'Fraud Indicators', count: userRole === 'sales_rep' ? 1 : 8 }
          ],
          stepDropoffs: [
            { step: 'Application Started', dropoff: 0 },
            { step: 'Basic Info', dropoff: 8 },
            { step: 'Business Details', dropoff: 15 },
            { step: 'Document Upload', dropoff: 28 },
            { step: 'Review & Submit', dropoff: 12 }
          ],
          applicationTrend: [
            { date: '2025-04-01', count: userRole === 'sales_rep' ? 3 : 15 },
            { date: '2025-04-08', count: userRole === 'sales_rep' ? 5 : 22 },
            { date: '2025-04-15', count: userRole === 'sales_rep' ? 4 : 19 },
            { date: '2025-04-22', count: userRole === 'sales_rep' ? 7 : 32 }
          ]
        };
      };

      // For mock purposes, add a slight delay to simulate API call
      setTimeout(() => {
        const mockData = generateMockData();
        setAnalyticsData(mockData);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch analytics data'));
      setLoading(false);
    }
  };

  // Fetch data when component mounts or when timeRange changes
  useEffect(() => {
    if (userRole !== undefined) {
      fetchAnalyticsData();
    }
  }, [timeRange, userRole, userId]);

  // Function to manually refresh data
  const refreshData = () => {
    fetchAnalyticsData();
  };

  return {
    analyticsData,
    loading,
    error,
    timeRange,
    setTimeRange,
    refreshData
  };
}
