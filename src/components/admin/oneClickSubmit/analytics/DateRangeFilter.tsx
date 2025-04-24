
import React from "react";
import { Button } from "@/components/ui/button";

interface DateRangeFilterProps {
  timeRange: "week" | "month" | "year";
  setTimeRange: (range: "week" | "month" | "year") => void;
}

export function DateRangeFilter({ timeRange, setTimeRange }: DateRangeFilterProps) {
  return (
    <div className="flex items-center space-x-2 bg-gray-100 rounded-md p-1">
      <Button
        variant="ghost"
        size="sm"
        className={`${timeRange === 'week' 
          ? 'bg-white shadow-sm' 
          : 'hover:bg-gray-200'} px-3 py-1 h-8`}
        onClick={() => setTimeRange('week')}
      >
        Week
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`${timeRange === 'month' 
          ? 'bg-white shadow-sm' 
          : 'hover:bg-gray-200'} px-3 py-1 h-8`}
        onClick={() => setTimeRange('month')}
      >
        Month
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`${timeRange === 'year' 
          ? 'bg-white shadow-sm' 
          : 'hover:bg-gray-200'} px-3 py-1 h-8`}
        onClick={() => setTimeRange('year')}
      >
        Year
      </Button>
    </div>
  );
}
