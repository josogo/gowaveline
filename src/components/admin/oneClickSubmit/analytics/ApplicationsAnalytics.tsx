
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { MetricsOverview } from './MetricsOverview';
import { DeclineAnalytics } from './DeclineAnalytics';
import { FunnelAnalytics } from './FunnelAnalytics';
import { TrendChart } from './TrendChart';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { StatusBreakdown } from './StatusBreakdown';

export function ApplicationsAnalytics() {
  const { 
    analyticsData, 
    loading, 
    error, 
    timeRange, 
    setTimeRange, 
    refreshData 
  } = useAnalyticsData();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Merchant Onboarding Analytics</CardTitle>
          <CardDescription>Key metrics and insights for merchant onboarding</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className={timeRange === 'week' ? 'bg-primary text-primary-foreground' : ''}
              onClick={() => setTimeRange('week')}
            >
              Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={timeRange === 'month' ? 'bg-primary text-primary-foreground' : ''}
              onClick={() => setTimeRange('month')}
            >
              Month
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={timeRange === 'year' ? 'bg-primary text-primary-foreground' : ''}
              onClick={() => setTimeRange('year')}
            >
              Year
            </Button>
          </div>
          <Button variant="outline" size="icon" onClick={refreshData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-80">
            <div className="text-lg text-muted-foreground">Loading analytics data...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-80">
            <div className="text-lg text-destructive">Error loading analytics data</div>
          </div>
        ) : analyticsData ? (
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="declines">Decline Analytics</TabsTrigger>
              <TabsTrigger value="funnel">Funnel Analysis</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <MetricsOverview data={analyticsData} />
              <StatusBreakdown data={analyticsData} />
            </TabsContent>
            <TabsContent value="declines">
              <DeclineAnalytics data={analyticsData} />
            </TabsContent>
            <TabsContent value="funnel">
              <FunnelAnalytics data={analyticsData} />
            </TabsContent>
            <TabsContent value="trends">
              <TrendChart data={analyticsData} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex items-center justify-center h-80">
            <div className="text-lg text-muted-foreground">No analytics data available</div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Data updated {analyticsData ? new Date().toLocaleString() : '-'}
        </p>
      </CardFooter>
    </Card>
  );
}

export default ApplicationsAnalytics;
