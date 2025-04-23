
import React from "react";
import { Progress } from "@/components/ui/progress";

export const ApplicationProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  const roundedProgress = Math.round(progress);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">
        Merchant Application
      </h2>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>Application Progress</span>
        <span>{roundedProgress}%</span>
      </div>
    </div>
  );
};
