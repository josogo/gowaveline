
import { AlertCircle } from 'lucide-react';

export const BusinessProfileAlert = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
        <div>
          <h3 className="font-medium text-blue-800">Application Analysis</h3>
          <p className="text-sm text-blue-700">
            Your merchant sells CBD products with monthly volume of $120,000.
            Based on your business profile, processing history, and documentation,
            here are your most compatible banking options:
          </p>
        </div>
      </div>
    </div>
  );
};
