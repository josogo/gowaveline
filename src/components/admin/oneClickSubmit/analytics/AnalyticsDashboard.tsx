
import React, { useState, useEffect } from "react";
import { useAnalyticsData } from "../hooks/useAnalyticsData";
import { Card, CardContent } from "@/components/ui/card";
import { KpiMetricsCards } from "./KpiMetricsCards";
import { StatusBreakdown } from "./StatusBreakdown";
import { DeclineAnalytics } from "./DeclineAnalytics";
import { FunnelAnalytics } from "./FunnelAnalytics";
import { TrendChart } from "./TrendChart";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, ShieldAlert } from "lucide-react";
import { DateRangeFilter } from "./DateRangeFilter";
import { WeeklySummary } from "./WeeklySummary";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define a type for user roles
type UserRole = 'sales_rep' | 'risk_analyst' | 'executive' | null;

export function AnalyticsDashboard() {
  const { 
    analyticsData, 
    loading, 
    error, 
    timeRange, 
    setTimeRange, 
    refreshData 
  } = useAnalyticsData();

  const [exportingData, setExportingData] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user role on component mount
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }
        
        // Check if the user has any roles
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user role:', error);
        }
        
        setUserRole(data?.role as UserRole || null);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const handleExportData = () => {
    setExportingData(true);
    // Simulate export delay
    setTimeout(() => {
      setExportingData(false);
      toast.success("Analytics data exported successfully");
    }, 1500);
    // In a real application, you would implement CSV/PDF export logic here
  };

  // Show loading state while checking user role
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-lg text-muted-foreground">Loading user permissions...</div>
      </div>
    );
  }

  // Show limited access message if the user doesn't have a role
  if (!userRole) {
    return (
      <div className="w-full p-6">
        <Card className="rounded-2xl shadow-md">
          <CardContent className="flex flex-col items-center justify-center h-80 p-6">
            <ShieldAlert className="h-12 w-12 text-amber-500 mb-4" />
            <h2 className="text-xl font-medium mb-2">Limited Access</h2>
            <p className="text-center text-muted-foreground max-w-md">
              You don't have the required permissions to view the analytics dashboard. 
              Please contact your administrator for assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white/70 shadow-sm backdrop-blur-md px-6 h-14 sticky top-0 z-50 flex items-center justify-between">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <span>📊</span> Merchant Analytics
          {userRole === 'executive' && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full ml-2">Executive View</span>}
          {userRole === 'risk_analyst' && <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full ml-2">Risk View</span>}
          {userRole === 'sales_rep' && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full ml-2">Sales View</span>}
        </h1>
        <div className="flex items-center gap-3">
          {userRole !== 'executive' && (
            <DateRangeFilter 
              timeRange={timeRange} 
              setTimeRange={setTimeRange} 
            />
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            className="flex items-center gap-1"
          >
            <RefreshCw size={14} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          {(userRole === 'executive' || userRole === 'risk_analyst') && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportData}
              disabled={exportingData || loading || !analyticsData}
              className="flex items-center gap-1"
            >
              <Download size={14} />
              <span className="hidden sm:inline">
                {exportingData ? "Exporting..." : "Export"}
              </span>
            </Button>
          )}
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-80">
            <div className="text-lg text-muted-foreground">Loading analytics data...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-80">
            <div className="text-lg text-destructive">Error loading analytics data</div>
          </div>
        ) : analyticsData ? (
          <div className="space-y-6">
            {/* Weekly Summary shown to all roles */}
            <WeeklySummary />
            
            {/* KPI Metrics shown to all roles */}
            <KpiMetricsCards data={analyticsData} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Application Volume Trend - shown to all roles */}
              <Card className="rounded-2xl shadow-md">
                <CardContent className="pt-6">
                  <h2 className="text-lg font-medium mb-4">Application Volume Trend</h2>
                  <TrendChart data={analyticsData} />
                </CardContent>
              </Card>
              
              {/* Status Breakdown - shown to all roles */}
              <Card className="rounded-2xl shadow-md">
                <CardContent className="pt-6">
                  <h2 className="text-lg font-medium mb-4">Status Breakdown</h2>
                  <StatusBreakdown data={analyticsData} />
                </CardContent>
              </Card>
            </div>
            
            {/* Decline Reasons Analysis - not shown to sales reps */}
            {(userRole === 'risk_analyst' || userRole === 'executive') && (
              <Card className="rounded-2xl shadow-md">
                <CardContent className="pt-6">
                  <h2 className="text-lg font-medium mb-4">Decline Reasons Analysis</h2>
                  <DeclineAnalytics data={analyticsData} />
                </CardContent>
              </Card>
            )}
            
            {/* Application Funnel Analysis - not shown to executives */}
            {userRole !== 'executive' && (
              <Card className="rounded-2xl shadow-md">
                <CardContent className="pt-6">
                  <h2 className="text-lg font-medium mb-4">Application Funnel Analysis</h2>
                  <FunnelAnalytics data={analyticsData} />
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-80">
            <div className="text-lg text-muted-foreground">No analytics data available</div>
          </div>
        )}
      </div>

      {/* Welcome banner for executives */}
      {userRole === 'executive' && analyticsData && (
        <div className="p-6 pt-0">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 rounded-2xl shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Welcome back, Executive 👋</h3>
              <p className="text-blue-700">
                Here's your executive summary. You're viewing key metrics across all sales representatives.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Custom message for sales reps */}
      {userRole === 'sales_rep' && analyticsData && (
        <div className="p-6 pt-0">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 rounded-2xl shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-green-800 mb-2">Your Applications Dashboard 🚀</h3>
              <p className="text-green-700">
                You're viewing data for applications you've submitted. Keep up the great work!
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default AnalyticsDashboard;
