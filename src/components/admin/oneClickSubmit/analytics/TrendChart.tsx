
import React from 'react';
import { AnalyticsData } from '../hooks/useAnalyticsData';
import { ChartContainer } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function TrendChart({ data }: { data: AnalyticsData }) {
  // Format the dates for better display
  const trendData = data.applicationTrend.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: item.count
  }));

  if (trendData.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">Application Trend Analysis</h3>
        <p className="text-muted-foreground mt-2">
          No trend data available for the selected time period.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Application Volume Trend</h3>
      <p className="text-sm text-muted-foreground">
        Daily application submission volume over time
      </p>

      <div className="h-80">
        <ChartContainer config={{}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="Applications"
                stroke="#3b82f6"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="mt-4">
        <h4 className="text-md font-medium mb-2">Volume Insights</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border rounded p-3">
            <div className="text-sm text-muted-foreground">Average Daily Volume</div>
            <div className="text-lg font-bold">
              {(trendData.reduce((sum, item) => sum + item.count, 0) / trendData.length).toFixed(1)}
            </div>
          </div>
          <div className="border rounded p-3">
            <div className="text-sm text-muted-foreground">Highest Volume Day</div>
            <div className="text-lg font-bold">
              {trendData.reduce((max, item) => item.count > max ? item.count : max, 0)}
            </div>
          </div>
          <div className="border rounded p-3">
            <div className="text-sm text-muted-foreground">Total Volume</div>
            <div className="text-lg font-bold">
              {trendData.reduce((sum, item) => sum + item.count, 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
