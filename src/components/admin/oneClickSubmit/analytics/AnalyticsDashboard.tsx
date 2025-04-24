
import React, { useState } from "react";
import { useAnalyticsData } from "../hooks/useAnalyticsData";
import { Card, CardContent } from "@/components/ui/card";
import { KpiMetricsCards } from "./KpiMetricsCards";
import { StatusBreakdown } from "./StatusBreakdown";
import { DeclineAnalytics } from "./DeclineAnalytics";
import { FunnelAnalytics } from "./FunnelAnalytics";
import { TrendChart } from "./TrendChart";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";
import { DateRangeFilter } from "./DateRangeFilter";
import { WeeklySummary } from "./WeeklySummary";

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

  const handleExportData = () => {
    setExportingData(true);
    // Simulate export delay
    setTimeout(() => setExportingData(false), 1500);
    // In a real application, you would implement CSV/PDF export logic here
  };

  return (
    <div className="w-full">
      <div className="bg-white/70 shadow-sm backdrop-blur-md px-6 h-14 sticky top-0 z-50 flex items-center justify-between">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <span>📊</span> Merchant Analytics
        </h1>
        <div className="flex items-center gap-3">
          <DateRangeFilter 
            timeRange={timeRange} 
            setTimeRange={setTimeRange} 
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            className="flex items-center gap-1"
          >
            <RefreshCw size={14} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
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
            <WeeklySummary />
            <KpiMetricsCards data={analyticsData} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="rounded-2xl shadow-md">
                <CardContent className="pt-6">
                  <h2 className="text-lg font-medium mb-4">Application Volume Trend</h2>
                  <TrendChart data={analyticsData} />
                </CardContent>
              </Card>
              
              <Card className="rounded-2xl shadow-md">
                <CardContent className="pt-6">
                  <h2 className="text-lg font-medium mb-4">Status Breakdown</h2>
                  <StatusBreakdown data={analyticsData} />
                </CardContent>
              </Card>
            </div>
            
            <Card className="rounded-2xl shadow-md">
              <CardContent className="pt-6">
                <h2 className="text-lg font-medium mb-4">Decline Reasons Analysis</h2>
                <DeclineAnalytics data={analyticsData} />
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-md">
              <CardContent className="pt-6">
                <h2 className="text-lg font-medium mb-4">Application Funnel Analysis</h2>
                <FunnelAnalytics data={analyticsData} />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center h-80">
            <div className="text-lg text-muted-foreground">No analytics data available</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
