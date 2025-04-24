
import React from 'react';
import { AnalyticsData } from '../hooks/useAnalyticsData';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function DeclineAnalytics({ data }: { data: AnalyticsData }) {
  // Sort reasons by count and get top reasons
  const topReasons = [...data.declineReasons]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map(item => ({
      name: item.reason.length > 20 ? item.reason.substring(0, 20) + '...' : item.reason,
      count: item.count
    }));

  // If there are no decline reasons, show a message
  if (topReasons.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">Decline Reasons Analysis</h3>
        <p className="text-muted-foreground mt-2">
          No decline data available for the selected time period.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Decline Reasons Analysis</h3>
      <p className="text-sm text-muted-foreground">
        Top reasons for application declines in the selected period
      </p>

      <div className="h-96">
        <ChartContainer config={{}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topReasons}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fontSize: 12 }} 
                width={120}
              />
              <Tooltip formatter={(value) => [`${value} applications`, 'Count']} />
              <Legend />
              <Bar 
                dataKey="count" 
                name="Number of Declines" 
                fill="#ef4444" 
                radius={[0, 4, 4, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="mt-4">
        <h4 className="text-md font-medium mb-2">Recommendations</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>Review the most common decline reasons to identify patterns</li>
          <li>Consider updating application instructions for frequently declined fields</li>
          <li>Implement pre-validation for fields with high error rates</li>
        </ul>
      </div>
    </div>
  );
}
