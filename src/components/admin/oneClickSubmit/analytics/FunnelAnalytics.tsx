
import React from 'react';
import { AnalyticsData } from '../hooks/useAnalyticsData';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export function FunnelAnalytics({ data }: { data: AnalyticsData }) {
  if (!data.stepDropoffs || data.stepDropoffs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No funnel data available for the selected time period
      </div>
    );
  }

  // Format the data for the chart
  const funnelData = data.stepDropoffs.map(step => ({
    name: step.step,
    dropoff: step.dropoff
  }));

  return (
    <div className="h-64">
      <ChartContainer config={{}}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={funnelData}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11 }}
            />
            <YAxis 
              label={{ 
                value: 'Dropoff %', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: 12, fill: '#64748b' }
              }} 
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar 
              dataKey="dropoff" 
              name="Dropoff Rate %" 
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
