
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid,
  Legend 
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface GrowthData {
  month: string;
  volume: number;
  growth: number;
}

interface GrowthChartProps {
  data: GrowthData[];
  year: number;
}

const GrowthChart: React.FC<GrowthChartProps> = ({ data, year }) => {
  const config = {
    volume: {
      label: 'Processing Volume',
      color: '#0EA5E9',
    },
    growth: {
      label: 'Growth Rate',
      theme: { light: '#f97316', dark: '#f97316' },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-orange-500">Monthly Processing Volume ({year})</CardTitle>
        <CardDescription>
          Month-over-month growth rate and processing volume
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[400px] pt-4">
        <ChartContainer 
          config={config} 
          className="h-full w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis 
                yAxisId="left" 
                orientation="left"
                tickFormatter={(value) => `$${value/1000}k`} 
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    return (
                      <ChartTooltipContent 
                        className="bg-background border border-input shadow-md"
                        active={active} 
                        payload={payload} 
                      />
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar 
                dataKey="volume" 
                name="Processing Volume" 
                yAxisId="left" 
                fill="#0EA5E9" 
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
              <Bar 
                dataKey="growth" 
                name="Growth %" 
                yAxisId="right" 
                fill="#f97316" 
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default GrowthChart;
