
import React from 'react';
import { AnalyticsData } from '../hooks/useAnalyticsData';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, LabelList } from 'recharts';

const STATUS_COLORS = {
  complete: '#10b981',
  incomplete: '#f59e0b',
  submitted: '#3b82f6',
  declined: '#ef4444',
  removed: '#6b7280'
};

export function StatusBreakdown({ data }: { data: AnalyticsData }) {
  // Map the data for the pie chart
  const chartData = data.applicationsByStatus
    .filter(item => item.count > 0)
    .map(item => ({
      name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
      value: item.count
    }));

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Application Status Breakdown</h3>
      <div className="h-72">
        <ChartContainer
          config={{
            status: { color: '#10b981' },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[entry.name.toLowerCase() as keyof typeof STATUS_COLORS] || '#9ca3af'}
                  />
                ))}
                <LabelList dataKey="name" position="outside" />
              </Pie>
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
