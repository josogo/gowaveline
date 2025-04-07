
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { IndustryList } from '@/components/admin/industries/IndustryList';
import { IndustryDetail } from '@/components/admin/industries/IndustryDetail';
import { Toaster } from '@/components/ui/toaster';

const IndustryDocuments = () => {
  const [selectedIndustryId, setSelectedIndustryId] = useState<string | null>(null);

  return (
    <AdminLayout>
      <div className="min-h-screen">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/4">
            <IndustryList onSelectIndustry={(id) => setSelectedIndustryId(id)} />
          </div>
          <div className="w-full lg:w-3/4">
            {selectedIndustryId ? (
              <IndustryDetail industryId={selectedIndustryId} />
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-medium text-gray-900">Select an Industry</h2>
                <p className="text-gray-500 mt-2">
                  Please select an industry from the list to view its details and documents.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default IndustryDocuments;
