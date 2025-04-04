
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface VolumeChartProps {
  data: Array<{
    month: string;
    volume: number;
  }>;
}

const VolumeChart: React.FC<VolumeChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Volume</CardTitle>
        <CardDescription>
          Your monthly transaction volume for the past 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `$${value/1000}k`} />
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Volume']} />
            <Bar dataKey="volume" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VolumeChart;
