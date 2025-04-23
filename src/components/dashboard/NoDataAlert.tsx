
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const NoDataAlert = () => {
  return (
    <div className="mb-8 bg-yellow-50 border-yellow-300 border p-4 rounded-lg flex items-start gap-3">
      <AlertTriangle className="text-yellow-500 h-5 w-5 mt-0.5" />
      <div>
        <h3 className="font-semibold text-yellow-800">Limited Data Extracted</h3>
        <p className="text-yellow-700">
          We couldn't extract specific data from your statement. This might be due to the format or structure of your uploaded file.
          For better results, try uploading a CSV or Excel version of your statement, or submit for manual analysis.
        </p>
      </div>
    </div>
  );
};

export default NoDataAlert;
