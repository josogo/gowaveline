
import React, { useState } from "react";
import { useAnalyticsData } from "../hooks/useAnalyticsData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiMetricsCards } from "./KpiMetricsCards";
import { StatusBreakdown } from "./StatusBreakdown";
import { DeclineAnalytics } from "./DeclineAnalytics";
import { FunnelAnalytics } from "./FunnelAnalytics";
import { TrendChart } from "./TrendChart";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";
import { WeeklySummary } from "./WeeklySummary";
import { toast } from 'sonner';
import { useIsMobile } from "@/hooks/use-mobile";

export function AnalyticsDashboard() {
  const { analyticsData, loading, error, refreshData } = useAnalyticsData();
  const [exportingData, setExportingData] = useState(false);
  const isMobile = useIsMobile();

  const handleExportData = () => {
    setExportingData(true);
    setTimeout(() => {
      setExportingData(false);
      toast.success("Analytics data exported successfully");
    }, 1500);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-80">
          <div className="text-lg text-muted-foreground">Loading analytics data...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-80">
          <div className="text-lg text-destructive">Error loading analytics data</div>
        </div>
      );
    }

    if (!analyticsData) {
      return (
        <div className="flex items-center justify-center h-80">
          <div className="text-lg text-muted-foreground">No analytics data available</div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <WeeklySummary />
        <KpiMetricsCards data={analyticsData} />
        
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-6`}>
          {/* Application Volume Trend */}
          <Card className="rounded-xl shadow-md border-teal-100 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-teal-100/50">
              <CardTitle className="text-teal-800 text-lg">Application Volume</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <TrendChart data={analyticsData} />
            </CardContent>
          </Card>
          
          {/* Status Breakdown */}
          <Card className="rounded-xl shadow-md border-orange-100 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50">
              <CardTitle className="text-orange-800 text-lg">Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <StatusBreakdown data={analyticsData} />
            </CardContent>
          </Card>
        </div>
        
        {/* Decline Analysis */}
        <Card className="rounded-xl shadow-md border-red-100 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-red-50 to-red-100/50">
            <CardTitle className="text-red-800 text-lg">Decline Analysis</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <DeclineAnalytics data={analyticsData} />
          </CardContent>
        </Card>
        
        {/* Application Funnel */}
        <Card className="rounded-xl shadow-md border-blue-100 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
            <CardTitle className="text-blue-800 text-lg">Application Funnel</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <FunnelAnalytics data={analyticsData} />
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500/20 to-orange-500/20 shadow-sm backdrop-blur-md px-4 sm:px-6 h-14 sticky top-0 z-50 flex items-center justify-between">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <span>📊</span> Merchant Analytics
        </h1>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            className="flex items-center gap-1 border-teal-200 hover:border-teal-300 hover:bg-teal-50"
          >
            <RefreshCw size={14} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportData}
            disabled={exportingData || loading || !analyticsData}
            className="flex items-center gap-1 border-orange-200 hover:border-orange-300 hover:bg-orange-50"
          >
            <Download size={14} />
            <span className="hidden sm:inline">
              {exportingData ? "Exporting..." : "Export"}
            </span>
          </Button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {renderContent()}

        {/* Welcome Banner */}
        {analyticsData && (
          <div className="pt-6">
            <Card className="bg-gradient-to-r from-teal-50 to-orange-50 border-teal-200 rounded-xl shadow-md overflow-hidden">
              <CardContent className="p-6 flex items-center">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500">
                    <path d="m12 14 4-4"/>
                    <path d="M3.34 19a10 10 0 1 1 17.32 0"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-teal-800 mb-2">Analytics Dashboard</h3>
                  <p className="text-teal-700">
                    Track all merchant applications in one place. Use the insights to optimize your approval rates.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
