
import React from "react";
import { Button } from "@/components/ui/button";
import { TimeRange } from "../hooks/useAnalyticsData";

interface DateRangeFilterProps {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

export function DateRangeFilter({ timeRange, setTimeRange }: DateRangeFilterProps) {
  return (
    <div className="flex items-center space-x-2 bg-gray-100 rounded-md p-1">
      <Button
        variant="ghost"
        size="sm"
        className={`${timeRange === '7d' 
          ? 'bg-white shadow-sm' 
          : 'hover:bg-gray-200'} px-3 py-1 h-8`}
        onClick={() => setTimeRange('7d')}
      >
        Week
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`${timeRange === '30d' 
          ? 'bg-white shadow-sm' 
          : 'hover:bg-gray-200'} px-3 py-1 h-8`}
        onClick={() => setTimeRange('30d')}
      >
        Month
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`${timeRange === '90d' 
          ? 'bg-white shadow-sm' 
          : 'hover:bg-gray-200'} px-3 py-1 h-8`}
        onClick={() => setTimeRange('90d')}
      >
        Quarter
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`${timeRange === 'all' 
          ? 'bg-white shadow-sm' 
          : 'hover:bg-gray-200'} px-3 py-1 h-8`}
        onClick={() => setTimeRange('all')}
      >
        All
      </Button>
    </div>
  );
}
