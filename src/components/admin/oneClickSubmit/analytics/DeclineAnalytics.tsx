
import React from 'react';
import { AnalyticsData } from '../hooks/useAnalyticsData';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export function DeclineAnalytics({ data }: { data: AnalyticsData }) {
  // Sort reasons by count and get top reasons
  const topReasons = [...data.declineReasons]
    .sort((a, b) => b.count - a.count)
    .slice(0, 7)
    .map(item => ({
      name: item.reason.length > 20 ? item.reason.substring(0, 20) + '...' : item.reason,
      count: item.count
    }));

  if (topReasons.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No decline data available for the selected time period
      </div>
    );
  }

  return (
    <div className="h-64">
      <ChartContainer config={{}}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topReasons}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fontSize: 12 }} 
              width={120}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar 
              dataKey="count" 
              name="Applications" 
              fill="#ef4444" 
              radius={[0, 4, 4, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
