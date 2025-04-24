
import React from 'react';
import { AnalyticsData } from '../hooks/useAnalyticsData';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

const STATUS_COLORS = {
  complete: '#10b981',
  incomplete: '#f59e0b',
  declined: '#ef4444'
};

export function StatusBreakdown({ data }: { data: AnalyticsData }) {
  const isMobile = useIsMobile();

  const chartData = data.applicationsByStatus
    .filter(item => item.count > 0)
    .map(item => ({
      name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
      value: item.count
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        No status data available
      </div>
    );
  }

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (isMobile && percent < 0.1) return null;
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return percent > 0.05 ? (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={isMobile ? 10 : 12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <div className={`h-${isMobile ? '48' : '64'}`}>
      <ChartContainer config={{}}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              innerRadius={isMobile ? 40 : 60}
              outerRadius={isMobile ? 70 : 100}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={STATUS_COLORS[entry.name.toLowerCase() as keyof typeof STATUS_COLORS] || '#9ca3af'}
                />
              ))}
            </Pie>
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
