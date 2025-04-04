
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  description: string;
  value: string;
  additionalInfo?: string;
  valueClassName?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  description,
  value,
  additionalInfo,
  valueClassName = "text-orange-500"
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className={`text-3xl font-bold ${valueClassName}`}>{value}</p>
        {additionalInfo && (
          <p className="text-sm text-muted-foreground mt-2">
            {additionalInfo}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
